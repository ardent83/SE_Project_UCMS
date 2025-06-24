import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '../../utils/test-utils';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { Route } from 'react-router-dom';

import ClassForm from '../ClassForm';
import { server } from '../../mocks/server';
import { db } from '../../mocks/db';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe('ClassForm Component - Edit Mode', () => {
    const CLASS_ID_WITH_DATA = '101';
    const CLASS_ID_WITHOUT_DATA = '102';

    beforeEach(() => {
        server.use(
            http.get(`${API_BASE_URL}/api/Classes/instructor/:classId`, (req) => {
                const { classId } = req.params;
                return HttpResponse.json(db.classes[classId], { status: 200 });
            })
        );
    });

    test('should display an error message when class is not found', async () => {
        server.use(
            http.get(`${API_BASE_URL}/api/Classes/instructor/211`, () => {
                return HttpResponse.json({message: "Class not found"}, { status: 404 });
            })
        );

        render(
            <ClassForm formType="edit" />,
            {
                initialRoute: `/class/edit/211`,
                routes: (
                    <>
                        <Route path="/class/edit/:classId" element={<ClassForm formType="edit" />} />
                    </>
                )
            }
        );

        expect(await screen.findByText("Class not found")).toBeInTheDocument();
    });

    test('should load and pre-populate the form with class data', async () => {
        render(
            <>
                <ClassForm formType="edit" />
            </>,
            {
                initialRoute: `/class/edit/${CLASS_ID_WITH_DATA}`,
                routes: (
                    <>
                        <Route path="/class/edit/:classId" element={<ClassForm formType="edit" />} />
                    </>
                )
            }
        );

        expect(await screen.findByDisplayValue(db.classes[CLASS_ID_WITH_DATA].title)).toBeInTheDocument();
        expect(await screen.findByText('دوشنبه', { selector: 'span' })).toBeInTheDocument();
        expect(await screen.findByText('09:00', { selector: 'span' })).toBeInTheDocument();
        expect(await screen.findByText('11:00', { selector: 'span' })).toBeInTheDocument();
    });

    test('should edit be okay when all data is valid', async () => {
        const user = userEvent.setup();

        server.use(
            http.patch(`${API_BASE_URL}/api/Classes/${CLASS_ID_WITHOUT_DATA}`, async () => {
                return HttpResponse.json({ message: 'Success' }, { status: 200 });
            })
        );

        render(
            <ClassForm formType="edit" />,
            {
                initialRoute: `/class/edit/${CLASS_ID_WITHOUT_DATA}`,
                routes: (
                    <>
                        <Route path="/class/edit/:classId" element={<ClassForm formType="edit" />} />
                        <Route path="/class/:classId" element={<div>شما به صفحه جزئیات کلاس هدایت شدید</div>} />
                    </>
                )
            }
        );

        const imageFile = new File([new ArrayBuffer(1 * 1024 * 1024)], 'image.png', {
            type: 'image/png',
        });
        
        await user.type(await screen.findByLabelText(/نام کلاس/i), 'کلاس ویرایش شده');
        await user.upload(await screen.findByTestId('profileImageInput'), imageFile);
        await user.type(await screen.findByLabelText(/تاریخ شروع/i), '2025-10-01');
        await user.type(await screen.findByLabelText(/تاریخ پایان/i), '2025-12-01');
        await user.selectOptions(await screen.findByLabelText(/روزهای هفته/i), '1');
        await user.type(await screen.findByLabelText(/زمان‌ شروع/i), '10:00');
        await user.type(await screen.findByLabelText(/زمان پایان/i), '12:00');
        await user.click(await screen.findByRole('button', { name: /افزودن جلسه/i }));
        await user.click(await screen.findByRole('button', { name: "ذخیره تغییرات" }));

        expect(await screen.findByText("!تغییرات کلاس با موفقیت ذخیره شد")).toBeInTheDocument();
    });

    test('should submit updated data successfully and navigate', async () => {
        const user = userEvent.setup();

        server.use(
            http.patch(`${API_BASE_URL}/api/Classes/${CLASS_ID_WITH_DATA}`, async () => {
                return HttpResponse.json({ message: 'Success' }, { status: 200 });
            })
        );

        const DestinationPage = () => <div>شما به صفحه جزئیات کلاس هدایت شدید</div>;

        render(
            <>
                <ClassForm formType="edit" />
            </>,
            {
                initialRoute: `/class/edit/${CLASS_ID_WITH_DATA}`,
                routes: (
                    <>
                        <Route path="/class/edit/:classId" element={<ClassForm formType="edit" />} />
                        <Route path="/class/:classId" element={<DestinationPage />} />
                    </>
                )
            }
        );

        const titleInput = await screen.findByDisplayValue(db.classes[CLASS_ID_WITH_DATA].title);
        await user.clear(titleInput);
        await user.type(titleInput, 'عنوان ویرایش شده');

        const submitButton = await screen.findByRole('button', { name: "ذخیره تغییرات" });
        await user.click(submitButton);

        expect(await screen.findByText("!تغییرات کلاس با موفقیت ذخیره شد")).toBeInTheDocument();
        expect(await screen.findByText("شما به صفحه جزئیات کلاس هدایت شدید")).toBeInTheDocument();
    });

    test('should navigate to class details on cancel', async () => {
        const user = userEvent.setup();

        render(
            <ClassForm formType="edit" />,
            {
                initialRoute: `/class/edit/${CLASS_ID_WITH_DATA}`,
                routes: (
                    <>
                        <Route path="/class/edit/:classId" element={<ClassForm formType="edit" />} />
                        <Route path="/class/:classId" element={<div>شما به صفحه جزئیات کلاس هدایت شدید</div>} />
                    </>
                )
            }
        );

        const cancelButton = await screen.findByRole('button', { name: "انصراف" });
        await user.click(cancelButton);

        expect(await screen.findByText("شما به صفحه جزئیات کلاس هدایت شدید")).toBeInTheDocument();
    });
});