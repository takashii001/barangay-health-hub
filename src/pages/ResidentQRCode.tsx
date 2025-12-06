import { useAuth } from '@/contexts/AuthContext';
import { QRCodeDisplay } from '@/components/features/QRCodeDisplay';

export default function ResidentQRCode() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My QR Code</h1>
        <p className="page-description">
          Your unique citizen ID for quick service access
        </p>
      </div>

      <QRCodeDisplay
        userId={`RES-${user?.name?.replace(/\s/g, '-').toUpperCase().slice(0, 8) || '001'}`}
        userName={user?.name || 'Resident User'}
        type="resident"
      />
    </div>
  );
}