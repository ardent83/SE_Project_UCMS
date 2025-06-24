import React from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { Header } from './components/Header';
import { ClassList } from './sections/class-list/ClassList';
import { ProjectList } from './sections/project-list/ProjectList';
import { ExerciseList } from './sections/exercise-list/ExerciseList';
import { ExamList } from './sections/exam-list/ExamList';


const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="w-full flex flex-col-reverse lg:flex-row justify-center items-start gap-4 p-4 overflow-x-hidden">
            <div className="w-full lg:max-w-60 flex-shrink-0">
                <ExerciseList userRoleId={user?.role?.id} />
            </div>

            <div className="w-full max-w-240 flex flex-col justify-start items-center gap-10">
                <Header />
                <ClassList userRoleId={user?.role?.id} userFullName={`${user?.firstName} ${user?.lastName}`} />
                <ProjectList userRoleId={user?.role?.id} />
                <ExamList userRoleId={user?.role?.id} />
            </div>
        </div>
    );
};

export default Dashboard;