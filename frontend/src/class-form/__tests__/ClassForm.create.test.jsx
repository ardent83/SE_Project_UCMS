import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '../../utils/test-utils';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { Route } from 'react-router-dom';
import { vi } from 'vitest';

import ClassForm from '../ClassForm';
import { server } from '../../mocks/server';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe('ClassForm Component - Create Mode', () => {
    test('should display required error messages when form is submitted empty', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);
        const submitButton = await screen.findByRole('button', { name: /ایجاد کلاس/i });
        await user.click(submitButton);

        expect(await screen.findByText('اسم کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('رمز عبور کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('تاریخ شروع کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('حداقل یک جلسه برای کلاس الزامی است')).toBeInTheDocument();
    });

    test('should display a password confirmation error if passwords do not match', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);
        const passwordInput = await screen.findByLabelText(/^رمز کلاس$/i);
        const confirmPasswordInput = await screen.findByLabelText(/تأیید رمز کلاس/i);
        const submitButton = await screen.findByRole('button', { name: /ایجاد کلاس/i });

        await user.type(passwordInput, '123456@Moha');
        await user.type(confirmPasswordInput, '654321@Moha');
        await user.click(submitButton);

        expect(await screen.findByText('تکرار رمز عبور با رمز عبور مطابقت ندارد')).toBeInTheDocument();
    });

    test('should display an error for an invalid profile image file type', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const file = new File([new ArrayBuffer(1 * 1024 * 1024)], 'image.svg', {
            type: 'image/svg',
        });
        const fileInput = await screen.findByTestId('profileImageInput');

        await user.upload(fileInput, file);
        await user.click(await screen.findByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText(/فرمت فایل تصویر پروفایل نامعتبر است/i)).toBeInTheDocument();
    });

    test('should display an error for a profile image that is too large', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large-image.png', {
            type: 'image/png',
        });
        const fileInput = await screen.findByTestId('profileImageInput');

        await user.upload(fileInput, largeFile);
        await user.click(await screen.findByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText(/حجم فایل تصویر پروفایل بیشتر از حد مجاز است/i)).toBeInTheDocument();
    });

    test('should display an error when adding a schedule with empty fields', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const addScheduleButton = await screen.findByRole('button', { name: /افزودن جلسه/i });
        await user.click(addScheduleButton);

        expect(await screen.findByText("لطفا روز، ساعت شروع و پایان جلسه را انتخاب کنید.")).toBeInTheDocument();
    });

    test('should display an error when start time is not before end time', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const daySelect = await screen.findByLabelText(/روزهای هفته/i);
        const startTimeInput = await screen.findByLabelText(/زمان‌ شروع/i);
        const endTimeInput = await screen.findByLabelText(/زمان پایان/i);
        const addScheduleButton = await screen.findByRole('button', { name: /افزودن جلسه/i });

        await user.selectOptions(daySelect, '1');
        await user.type(startTimeInput, '14:00');
        await user.type(endTimeInput, '10:00');

        await user.click(addScheduleButton);

        expect(await screen.findByText("ساعت پایان جلسه باید بعد از ساعت شروع باشد.")).toBeInTheDocument();
    });

    test('should display an error when adding a schedule with overlapping times', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const daySelect = await screen.findByLabelText(/روزهای هفته/i);
        const startTimeInput = await screen.findByLabelText(/زمان‌ شروع/i);
        const endTimeInput = await screen.findByLabelText(/زمان پایان/i);
        const addScheduleButton = await screen.findByRole('button', { name: /افزودن جلسه/i });

        await user.selectOptions(daySelect, '1');
        await user.type(startTimeInput, '08:00');
        await user.type(endTimeInput, '10:00');
        await user.click(addScheduleButton);

        await user.selectOptions(daySelect, '1');
        await user.type(startTimeInput, '09:00');
        await user.type(endTimeInput, '11:00');
        await user.click(addScheduleButton);

        await user.click(await screen.findByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText("جلسات در یک روز هفته نباید همپوشانی داشته باشند.")).toBeInTheDocument();
    });

    test('should allow adding and removing schedules from the list', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const daySelect = await screen.findByLabelText(/روزهای هفته/i);
        const startTimeInput = await screen.findByLabelText(/زمان‌ شروع/i);
        const endTimeInput = await screen.findByLabelText(/زمان پایان/i);
        const addScheduleButton = await screen.findByRole('button', { name: /افزودن جلسه/i });

        await user.selectOptions(daySelect, '2');
        await user.type(startTimeInput, '08:00');
        await user.type(endTimeInput, '10:00');
        await user.click(addScheduleButton);

        await user.selectOptions(daySelect, '4');
        await user.type(startTimeInput, '14:00');
        await user.type(endTimeInput, '16:00');
        await user.click(addScheduleButton);

        const scheduleList = await screen.findByRole('list');
        expect(within(scheduleList).getByText('دوشنبه')).toBeInTheDocument();
        expect(within(scheduleList).getByText('چهارشنبه')).toBeInTheDocument();

        const removeButtons = within(scheduleList).getAllByTestId('remove-button');
        expect(removeButtons).toHaveLength(2);

        await user.click(removeButtons[0]);

        expect(within(scheduleList).queryByText('دوشنبه')).not.toBeInTheDocument();
        expect(within(scheduleList).getByText('چهارشنبه')).toBeInTheDocument();
        expect(within(scheduleList).getAllByTestId('remove-button')).toHaveLength(1);
    });

    test('should trigger file input click when attachment icon is clicked', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const fileInput = await screen.findByTestId('profileImageInput');
        const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {});

        const icon = await screen.findByTestId('file-upload-icon');
        await user.click(icon);

        expect(clickSpy).toHaveBeenCalled();

        clickSpy.mockRestore();
    });

    test('should close alert after ESC key press', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);

        const addScheduleButton = await screen.findByRole('button', { name: /افزودن جلسه/i });
        await user.click(addScheduleButton);

        expect(await screen.findByText("لطفا روز، ساعت شروع و پایان جلسه را انتخاب کنید.")).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(await screen.queryByText("لطفا روز، ساعت شروع و پایان جلسه را انتخاب کنید.")).not.toBeInTheDocument();
    });

    test('should navigate to classes list on cancel', async () => {
        const user = userEvent.setup();

        render(
            <ClassForm formType="create" />,
            {
                initialRoute: `/class/create`,
                routes: (
                    <>
                        <Route path="/class/create" element={<ClassForm formType="create" />} />
                        <Route path="/classes" element={<div>شما به صفحه لیست کلاس‌ها هدایت شدید</div>} />
                    </>
                )
            }
        );

        const cancelButton = await screen.findByRole('button', { name: "انصراف" });
        await user.click(cancelButton);

        expect(await screen.findByText("شما به صفحه لیست کلاس‌ها هدایت شدید")).toBeInTheDocument();
    });

    test('should submit the form successfully and show success alert', async () => {
        const user = userEvent.setup();

        server.use(
            http.post(`${API_BASE_URL}/api/Classes`, () => {
                return HttpResponse.json({ data: { id: 101 } }, { status: 201 });
            })
        );

        render(<ClassForm formType="create" />);

        await user.type(await screen.findByLabelText(/نام کلاس/i), 'کلاس تست جدید');
        await user.type(await screen.findByLabelText(/^رمز کلاس$/i), 'ValidPass123!');
        await user.type(await screen.findByLabelText(/تأیید رمز کلاس/i), 'ValidPass123!');
        await user.type(await screen.findByLabelText(/تاریخ شروع/i), '2025-10-01');
        await user.type(await screen.findByLabelText(/تاریخ پایان/i), '2025-12-01');
        await user.selectOptions(await screen.findByLabelText(/روزهای هفته/i), '1');
        await user.type(await screen.findByLabelText(/زمان‌ شروع/i), '10:00');
        await user.type(await screen.findByLabelText(/زمان پایان/i), '12:00');
        await user.click(await screen.findByRole('button', { name: /افزودن جلسه/i }));
        await user.click(await screen.findByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText('!کلاس با موفقیت ایجاد شد')).toBeInTheDocument();
    });

    test('should display an API error message if submission fails', async () => {
        const user = userEvent.setup();
        const MOCK_ERROR_MESSAGE = 'خطایی در سمت سرور رخ داد';

        server.use(
            http.post(`${API_BASE_URL}/api/Classes`, () => {
                return HttpResponse.json({ message: MOCK_ERROR_MESSAGE }, { status: 500 });
            })
        );

        render(<ClassForm formType="create" />);

        await user.type(await screen.findByLabelText(/نام کلاس/i), 'کلاس تست جدید');
        await user.type(await screen.findByLabelText(/^رمز کلاس$/i), 'ValidPass123!');
        await user.type(await screen.findByLabelText(/تأیید رمز کلاس/i), 'ValidPass123!');
        await user.type(await screen.findByLabelText(/تاریخ شروع/i), '2025-10-01');
        await user.type(await screen.findByLabelText(/تاریخ پایان/i), '2025-12-01');
        await user.selectOptions(await screen.findByLabelText(/روزهای هفته/i), '1');
        await user.type(await screen.findByLabelText(/زمان‌ شروع/i), '10:00');
        await user.type(await screen.findByLabelText(/زمان پایان/i), '12:00');
        await user.click(await screen.findByRole('button', { name: /افزودن جلسه/i }));
        await user.click(await screen.findByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText(MOCK_ERROR_MESSAGE)).toBeInTheDocument();
    });
});