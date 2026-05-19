import crypto from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createOrderMock = vi.hoisted(() => vi.fn());

vi.mock('razorpay', () => ({
  default: vi.fn().mockImplementation(() => ({
    orders: {
      create: createOrderMock,
    },
  })),
}));

describe('paymentService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
  });

  it('creates registration orders for INR 2,999', async () => {
    createOrderMock.mockResolvedValue({ id: 'order_123' });
    const { createRegistrationOrder } = await import('./paymentService.js');

    await createRegistrationOrder({
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane@example.com',
    });

    expect(createOrderMock).toHaveBeenCalledWith({
      amount: 299900,
      currency: 'INR',
      receipt: expect.stringMatching(/^reg_/),
      notes: {
        attendeeName: 'Jane Doe',
        attendeeEmail: 'jane@example.com',
        purpose: 'registration',
      },
    });
  });

  it('verifies a valid Razorpay payment signature', async () => {
    const { verifyRazorpaySignature } = await import('./paymentService.js');
    const orderId = 'order_123';
    const paymentId = 'pay_123';
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    expect(verifyRazorpaySignature({ orderId, paymentId, signature })).toBe(true);
  });

  it('rejects an invalid Razorpay payment signature', async () => {
    const { verifyRazorpaySignature } = await import('./paymentService.js');

    expect(
      verifyRazorpaySignature({
        orderId: 'order_123',
        paymentId: 'pay_123',
        signature: 'invalid_signature',
      })
    ).toBe(false);
  });
});
