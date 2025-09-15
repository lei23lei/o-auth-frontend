import { auth } from "@/auth";

export const TempShowAuth = async () => {
  const session = await auth();
  console.log(session);
  return <div>{JSON.stringify(session)}</div>;
};
