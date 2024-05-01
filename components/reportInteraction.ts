import { ref, push } from "firebase/database";
import { db } from "@/firebase-config";
import { FormState } from "@/app/(app)/(tabs)/report";

const reportTypes = [
  "Violation Reports",
  "Maintenance Issues",
  "Safety Issues",
  "Suggestions for Improvement",
  "Feedback on Parking Enforcement",
] as const;


export const sendReport = async (form: FormState, email: string) => {
  if (
    !form.title ||
    !form.description ||
    form.title.trim() === "" ||
    form.description.trim() === ""
  ) {
    throw new Error("Please fill in the title and description fields.");
  }
  form.email = email;
  form.date = new Date().toISOString();

  await push(ref(db, "/reports"), form);
};
