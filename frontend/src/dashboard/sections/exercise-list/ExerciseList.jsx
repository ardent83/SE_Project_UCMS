import React from 'react';
import { TaskSquare } from 'iconsax-react';
import { HeadSection } from '../../components/HeadSection';
import { useExerciseList } from './hooks/useExerciseList';
import { ExerciseCard } from './components/ExerciseCard';
import { useNavigate } from 'react-router-dom';

export const ExerciseList = ({ userRoleId }) => {
    const { exercises, loading, error } = useExerciseList({ userRoleId });
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col justify-start items-center gap-4">
            <HeadSection
                onClick={() => navigate('/exercises')}
                title="تکالیف"
                icon={ <TaskSquare color="var(--color-redp)" size={35} variant="Bold" />}
            />
            {!loading && !error && exercises.length > 0 && (
                <div dir="rtl" className="w-full flex flex-wrap gap-4 justify-center sm:justify-start">
                    {exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="w-full sm:w-55 lg:w-full flex justify-center"
                        >
                            <ExerciseCard exercise={exercise} />
                        </div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="text-center py-6 text-neutralgray-4">... در حال بارگذاری تکالیف</div>
            )}

            {error && (
                <div className="text-center py-6 text-stateerror">{error}</div>
            )}

            {!loading && !error && exercises.length === 0 && (
                <div className="text-center py-6 text-neutralgray-4">.تکلیفی برای نمایش وجود ندارد</div>
            )}
        </div>
    );
};