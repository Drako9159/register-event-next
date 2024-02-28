import axios, { AxiosError } from "axios";
import { useEffect } from "react";

export default function SendMail({ email }: any) {
  useEffect(() => {
    action();
  }, []);

  async function action() {
    console.log("here");
    try {
      const res = await axios.post(
        "/api/auth/actions/confirmation/generate-token",
        {
          email,
        }
      );
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  }
}
