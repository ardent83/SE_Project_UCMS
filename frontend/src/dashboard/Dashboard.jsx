import React from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { Header } from './components/Header'
import { ClassList } from './sections/class-list/ClassList';
import { ProjectList } from './sections/project-list/ProjectList';
import { ExerciseList } from './sections/exercise-list/ExerciseList';


const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className='w-full flex max-[1192px]:flex-col max-[1192px]:justify-start max-[1192px]:items-center justify-center items-start p-4 gap-4'>
            <ExerciseList userRoleId={user?.role?.id}/>
            <div className="w-full max-w-240 flex flex-col justify-start items-center gap-6">
                <Header />
                <ClassList userRoleId={user?.role?.id} userFullName={`${user?.firstName} ${user?.lastName}`} />
                <ProjectList userRoleId={user?.role?.id} />
            </div>
        </div>
    );
};

export default Dashboard;
