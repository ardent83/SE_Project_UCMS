import React from 'react';
import { Task } from 'iconsax-react';
import { HeadSection } from '../../components/HeadSection';
import { useExerciseList } from './hooks/useExerciseList';
import { ExerciseCard } from './components/ExerciseCard';
import { useNavigate } from 'react-router-dom';

export const ExerciseList = ({ userRoleId }) => {
    const { exercises, loading, error } = useExerciseList({ userRoleId });
    const navigate = useNavigate();

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-6 text-neutralgray-4">... در حال بارگذاری تکالیف</div>;
        }

        if (error) {
            return <div className="text-center py-6 text-stateerror">{error}</div>;
        }

        if (exercises.length === 0) {
            return <div className="text-center py-6 text-neutralgray-4">.تکلیفی برای نمایش وجود ندارد</div>;
        }

        return (
            <div className="w-full flex justify-center items-start flex-wrap gap-4">
                {exercises.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
            </div>
        );
    };


    return (
        <div className="w-full max-w-60 flex flex-col justify-start items-center gap-4">
            <HeadSection
                onClick={() => navigate('/exercises')}
                title="تکالیف"
                icon={<Task variant="Bold" color="var(--color-redp)" size={24} />}
            />
            {renderContent()}
        </div>
    );
};