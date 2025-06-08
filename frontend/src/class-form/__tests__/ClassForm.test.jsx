import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../utils/test-utils';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';

import ClassForm from '../ClassForm';
import { server } from '../../mocks/server';

describe('ClassForm Component', () => {
    test('should display required error messages when form is submitted empty', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);
        const submitButton = screen.getByRole('button', { name: /ایجاد کلاس/i });

        await user.click(submitButton);

        expect(await screen.findByText('اسم کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('رمز عبور کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('تاریخ شروع کلاس الزامی است')).toBeInTheDocument();
        expect(await screen.findByText('حداقل یک جلسه برای کلاس الزامی است')).toBeInTheDocument();
    });

    test('should display a password confirmation error if passwords do not match', async () => {
        const user = userEvent.setup();
        render(<ClassForm formType="create" />);
        const passwordInput = screen.getByLabelText(/^رمز کلاس$/i);
        const confirmPasswordInput = screen.getByLabelText(/تأیید رمز کلاس/i);
        const submitButton = screen.getByRole('button', { name: /ایجاد کلاس/i });

        await user.type(passwordInput, '123456@Moha');
        await user.type(confirmPasswordInput, '654321@Moha');
        await user.click(submitButton);

        expect(await screen.findByText('تکرار رمز عبور با رمز عبور مطابقت ندارد')).toBeInTheDocument();
    });


    test('should submit the form successfully with valid data and show success alert', async () => {
        const user = userEvent.setup();
        const handleSuccess = vi.fn();

        server.use(
            http.post('*/api/Classes', () => {
                return HttpResponse.json({}, { status: 201 });
            })
        );

        render(<ClassForm formType="create" onSuccess={handleSuccess} />);

        await user.type(screen.getByLabelText(/نام کلاس/i), 'کلاس تست جدید');

        await user.type(screen.getByLabelText(/^رمز کلاس$/i), 'ValidPass123!');
        await user.type(screen.getByLabelText(/تأیید رمز کلاس/i), 'ValidPass123!');

        await user.type(screen.getByLabelText(/تاریخ شروع/i), '2025-10-01');
        await user.type(screen.getByLabelText(/تاریخ پایان/i), '2025-12-01');

        await user.selectOptions(screen.getByLabelText(/روزهای هفته/i), '1');
        await user.type(screen.getByLabelText(/زمان‌ شروع/i), '10:00');
        await user.type(screen.getByLabelText(/زمان پایان/i), '12:00');
        await user.click(screen.getByRole('button', { name: /افزودن جلسه/i }));

        await user.click(screen.getByRole('button', { name: /ایجاد کلاس/i }));

        expect(await screen.findByText('!کلاس با موفقیت ایجاد شد')).toBeInTheDocument();
        expect(handleSuccess).toHaveBeenCalledTimes(1);
    });
});