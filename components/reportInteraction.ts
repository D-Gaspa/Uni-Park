import {push, ref} from "firebase/database";
import {db} from "@/firebase-config";
import {FormState} from "@/app/(app)/(tabs)/report";

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
