import axios from "axios";
import { getSession } from "next-auth/react";
import QRCode from "react-qr-code";

interface QrCodeGeneratorProps {
  data: string;
}

export default function QrCodeGenerator() {
  async function generate() {
    const session: any = await getSession();
    const userId = session?.user?._id;
    const response = await axios.post("/api/auth/actions/qr/generate-qr", {
      userId,
    });
  }
  generate();
  const data = {
    master: "message",
    july: "extreme",
  };

  const dataString = JSON.stringify({ data }, null, 2);
  return (
    <div className="m-8">
      <QRCode value={dataString} />
    </div>
  );
}
