import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  verifyPartnerToken,
  registerApprovedPartner,
  removeApprovedPartner,
  generateRandomPassword,
} from '@/lib/auth';
import {
  getServerAccountById,
  updateServerAccount,
  deleteServerAccount,
} from '@/lib/serverStore';

const updateAccountSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  businessName: z.string().trim().min(2).max(150).optional(),
  role: z.enum(['umkm', 'pengelola']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
  resetPassword: z.boolean().optional(),
  newPassword: z.string().min(6).optional(),
});

// PUT /api/petugas/accounts/[id] - Update account or reset password
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const session = verifyPartnerToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token petugas diperlukan.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const existing = getServerAccountById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Akun mitra tidak ditemukan.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = updateAccountSchema.parse(body);

    let newGeneratedPassword: string | null = null;

    // Password reset handling
    if (validated.resetPassword || validated.newPassword) {
      newGeneratedPassword = validated.newPassword?.trim() || generateRandomPassword(8);
      // Re-register in auth store with the new password
      registerApprovedPartner(
        existing.merchantId,
        newGeneratedPassword,
        validated.role || existing.role,
        validated.name || existing.name,
        validated.businessName || existing.businessName
      );
    } else if (validated.name || validated.businessName || validated.role) {
      // Re-sync name/business in auth store if changed
      registerApprovedPartner(
        existing.merchantId,
        '123456', // dummy fallback salt update, DYNAMIC_PARTNERS holds hash
        validated.role || existing.role,
        validated.name || existing.name,
        validated.businessName || existing.businessName
      );
    }

    const updated = updateServerAccount(existing.id, {
      name: validated.name || existing.name,
      businessName: validated.businessName || existing.businessName,
      role: validated.role || existing.role,
      status: validated.status || existing.status,
    });

    return NextResponse.json({
      success: true,
      message: newGeneratedPassword
        ? `Password untuk ${existing.name} berhasil di-reset.`
        : `Detail akun mitra "${existing.name}" berhasil diperbarui.`,
      data: updated,
      newGeneratedPassword, // ONE-TIME VIEW for Petugas to dispatch via WhatsApp
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.errors ? err.errors[0]?.message : err.message },
      { status: 400 }
    );
  }
}

// DELETE /api/petugas/accounts/[id] - Delete partner account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const session = verifyPartnerToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Token petugas diperlukan.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const existing = getServerAccountById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Akun mitra tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Revoke from auth
    removeApprovedPartner(existing.merchantId);

    // Cascading delete: removes account AND all places owned by this account
    const { deletedPlacesCount } = deleteServerAccount(existing.id);

    return NextResponse.json({
      success: true,
      message: `Akun mitra "${existing.name}" dan ${deletedPlacesCount} tempat kelolaannya berhasil dihapus dari platform.`,
      deletedPlacesCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menghapus akun mitra.' },
      { status: 500 }
    );
  }
}
