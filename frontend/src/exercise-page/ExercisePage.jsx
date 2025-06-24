import React from "react";
import ExercisePageInstructor from "./ExercisePageInstructor.jsx";
import ExercisePageStudent from "./ExercisePageStudent.jsx";
import {useAuth} from "../auth/context/AuthContext.jsx";



const ExercisePage = () => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    if (userRole === "Instructor") {
        return <ExercisePageInstructor />;
    } else if (userRole === "Student") {
        return <ExercisePageStudent />;
    } else {
        return (
            <div className="text-center text-red-600 mt-10">
                نقش کاربر معتبر نیست.
            </div>
        );
    }
};

export default ExercisePage;