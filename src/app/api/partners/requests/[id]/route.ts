import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerRequests, updateServerRequest, addServerPlace, addServerAccount } from '@/lib/serverStore';
import { registerApprovedPartner, verifyPartnerToken } from '@/lib/auth';
import { ManagedPlace, PartnerAccount } from '@/types';

const patchSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify Petugas Authorization Token
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const session = verifyPartnerToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token petugas valid diperlukan.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validated = patchSchema.parse(body);

    const requests = getServerRequests();
    const reqIndex = requests.findIndex((r) => r.id === id);

    if (reqIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Pengajuan mitra tidak ditemukan.' },
        { status: 404 }
      );
    }

    const targetReq = requests[reqIndex];

    if (targetReq.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Pengajuan ini sudah berstatus "${targetReq.status}".` },
        { status: 400 }
      );
    }

    // 2. Process Approval or Rejection
    const reviewedAt = new Date().toISOString();
    const reviewerName = session.name || 'Petugas Otoritas';

    if (validated.status === 'approved') {
      const ownerId = targetReq.targetExistingOwnerId || targetReq.whatsapp;

      // A. If new applicant, register their credentials and create partner account
      const passwordToUse = targetReq.desiredPassword || targetReq.desiredPin || 'Manjalan2026';
      if (!targetReq.targetExistingOwnerId) {
        registerApprovedPartner(
          ownerId,
          passwordToUse,
          targetReq.type === 'umkm' ? 'umkm' : 'pengelola',
          targetReq.applicantName,
          targetReq.businessName
        );

        addServerAccount({
          id: `acc-${Date.now()}`,
          merchantId: ownerId,
          role: targetReq.type === 'umkm' ? 'umkm' : 'pengelola',
          name: targetReq.applicantName,
          businessName: targetReq.businessName,
          whatsapp: targetReq.whatsapp,
          verified: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      }

      // B. Create the ManagedPlace associated with this 1 owner account
      const newPlace: ManagedPlace = {
        id: `plc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: targetReq.type,
        ownerMerchantId: ownerId,
        name: targetReq.businessName,
        category: targetReq.category,
        categoryLabel:
          targetReq.type === 'umkm'
            ? 'Mitra UMKM Terverifikasi'
            : 'Destinasi Wisata Terverifikasi',
        location: targetReq.location,
        description: targetReq.description,
        priceRange: targetReq.priceRange || 'Standar Lapangan',
        hasQris: false,
        needsCash: true,
        signalStatus: 'Kesiapan Lapangan Terverifikasi',
        signalOk: true,
        whatsapp: targetReq.whatsapp,
        image:
          targetReq.type === 'umkm'
            ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      addServerPlace(newPlace);

      targetReq.status = 'approved';
      targetReq.reviewedAt = reviewedAt;
      targetReq.reviewedBy = reviewerName;
      updateServerRequest(targetReq);

      return NextResponse.json({
        success: true,
        message: `Pengajuan "${targetReq.businessName}" berhasil di-ACC! Akun mitra otomatis aktif dengan ID ${ownerId}.`,
        data: {
          request: targetReq,
          createdPlace: newPlace,
          merchantId: ownerId,
          temporaryPassword: passwordToUse,
        },
      });
    } else {
      targetReq.status = 'rejected';
      targetReq.reviewedAt = reviewedAt;
      targetReq.reviewedBy = reviewerName;
      targetReq.rejectionReason = validated.rejectionReason || 'Tidak memenuhi kualifikasi lapangan.';
      updateServerRequest(targetReq);

      return NextResponse.json({
        success: true,
        message: `Pengajuan "${targetReq.businessName}" telah ditolak.`,
        data: {
          request: targetReq,
        },
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors ? err.errors[0]?.message : err.message },
      { status: 400 }
    );
  }
}
