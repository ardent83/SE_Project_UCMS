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
        <div className="w-full flex flex-col items-center gap-2">
            <HeadSection
                onClick={() => { navigate('/classes'); }}
                title="کلاس‌ها"
                icon={<Book1 variant="Bold" color="var(--color-redp)" size={24} />}
            />
            {loading && <div className="text-neutralgray-5 mt-4">...در حال بارگذاری کلاس‌ها</div>}

            {error && <div className="text-body-04 text-stateerror mt-4">{error}</div>}

            {classes.length === 0 && (
                <div data-testid="class-list-section" className="text-center py-6 text-neutralgray-4">.کلاسی برای نمایش وجود ندارد</div>
            )}

            {!loading && !error && (
                <div
                    dir="rtl"
                    className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
                >
                    {classes.map((detail) => (
                        <div key={detail.id} className="flex justify-center">
                            <ClassCard
                                id={detail.id}
                                color={detail.color}
                                title={detail.title}
                                instructor={detail.instructor}
                                days={detail.days}
                                times={detail.times}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};