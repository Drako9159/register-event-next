import axios, { AxiosError } from "axios";
import { useEffect } from "react";

export default function SendMailConfirmation(email: string) {
  /*useEffect(() => {
    async function action() {
      try {
        // const user: any = await getSession();
        // const email = user?.user?.email;
        await axios.post("/api/auth/actions/confirmation/generate-token", {
          email,
        });
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
      }
    }
    return () => {
      action();
    };
  }, []);*/
  async function action() {
    try {
      // const user: any = await getSession();
      // const email = user?.user?.email;
      await axios.post("/api/auth/actions/confirmation/generate-token", {
        email,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  }
  action();
}
