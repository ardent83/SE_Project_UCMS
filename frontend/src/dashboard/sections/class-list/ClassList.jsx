import React from 'react';
import { Book1 } from 'iconsax-react';
import { ClassCard } from './components/ClassCard';
import { HeadSection } from '../../components/HeadSection';
import { useClassList } from './hooks/useClassList';

export const ClassList = ({ userRoleId, userFullName }) => {
    const { classes, loading, error } = useClassList({ userRoleId, userFullName });

    return (
        <div className="w-full max-w-240 flex flex-col items-center gap-2">
            <HeadSection title="کلاس‌ها" icon={<Book1 variant="Bold" color="var(--color-redp)" size={24} />} />
            {loading && <div className="text-neutralgray-5 mt-4">...در حال بارگذاری کلاس‌ها</div>}
            
            {error && <div className="text-body-04 text-stateerror mt-4">{error}</div>}

            {!loading && !error && (
                <div className="w-full flex justify-between flex-row-reverse items-start flex-wrap">
                    {classes.map((detail) => (
                        <ClassCard
                            key={detail.id}
                            id={detail.id}
                            color={detail.color}
                            title={detail.title}
                            instructor={detail.instructor}
                            days={detail.days}
                            times={detail.times}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};