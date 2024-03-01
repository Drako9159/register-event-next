
import QRCode from "react-qr-code";

interface QrCodeGeneratorParams {
  data: string;
}

export default function QrCodeGenerator({ data }: QrCodeGeneratorParams) {
  

  return (
    <div className="m-8">
      <QRCode value={JSON.stringify({ data }, null, 2)} />
    </div>
  );
}
