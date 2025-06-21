import React from "react";
import PhasePageForInstructor from "./PhasePageForInstructor.jsx";
import PhasePageForStudent from "./PhasePageForStudent.jsx";
import {useAuth} from "../auth/context/AuthContext.jsx";



const PhasePage = () => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    if (userRole === "Instructor") {
        return <PhasePageForInstructor />;
    } else if (userRole === "Student") {
        return <PhasePageForStudent />;
    } else {
        return (
            <div className="text-center text-red-600 mt-10">
                نقش کاربر معتبر نیست.
            </div>
        );
    }
};

export default PhasePage;
