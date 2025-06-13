import React from 'react';
import { Book1 } from 'iconsax-react';
import { ClassCard } from './components/ClassCard';
import { HeadSection } from '../../components/HeadSection';
import { useClassList } from './hooks/useClassList';
import { useNavigate } from 'react-router-dom';

export const ClassList = ({ userRoleId, userFullName }) => {
    const { classes, loading, error } = useClassList({ userRoleId, userFullName });
    const navigate = useNavigate();
    return (
        <div className="w-full max-w-240 flex flex-col items-center gap-2">
            <HeadSection 
                onClick={() => {navigate('/classes'); console.log('HeadSection clicked');}}
                title="کلاس‌ها" 
                icon={<Book1 variant="Bold" color="var(--color-redp)" size={24} />} 
            />
            {loading && <div className="text-neutralgray-5 mt-4">...در حال بارگذاری کلاس‌ها</div>}
            
            {error && <div className="text-body-04 text-stateerror mt-4">{error}</div>}

            {!loading && !error && (
                <div className="w-full flex justify-start flex-row-reverse items-start flex-wrap gap-2">
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