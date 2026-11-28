import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (!serverKey) {
            return NextResponse.json(
                { success: false, message: "MIDTRANS_SERVER_KEY belum diatur di .env.local" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { orderId, grossAmount, customerDetails, itemDetails } = body;

        const amount = Math.round(Number(grossAmount) || 0);
        if (!orderId || amount <= 0) {
            return NextResponse.json(
                { success: false, message: "Order ID atau nominal pembayaran tidak valid." },
                { status: 400 }
            );
        }

        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
        const snapUrl = isProduction
            ? "https://app.midtrans.com/snap/v1/transactions"
            : "https://app.sandbox.midtrans.com/snap/v1/transactions";

        const authString = Buffer.from(`${serverKey}:`).toString("base64");

        // Tambahkan suffix singkat agar retry pembayaran tidak bentrok order_id di Midtrans
        const uniqueOrderId = `${String(orderId).slice(0, 35)}-${Date.now().toString().slice(-5)}`;

        const payload = {
            transaction_details: {
                order_id: uniqueOrderId,
                gross_amount: amount,
            },
            customer_details: {
                first_name: (customerDetails?.name || "Penyewa Sportify").slice(0, 50),
                email: customerDetails?.email || "penyewa@sportify.test",
                phone: customerDetails?.phone || "08123456789",
            },
            item_details: Array.isArray(itemDetails) && itemDetails.length > 0
                ? itemDetails.map((item) => ({
                    id: String(item.id || "ITEM-1").slice(0, 50),
                    price: Math.round(Number(item.price) || amount),
                    quantity: Number(item.quantity) || 1,
                    name: String(item.name || "Sewa Lapangan Sportify").slice(0, 50),
                }))
                : [
                    {
                        id: "BOOKING-1",
                        price: amount,
                        quantity: 1,
                        name: "Sewa Lapangan Sportify",
                    },
                ],
        };

        const response = await fetch(snapUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || !data.token) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.error_messages?.[0] || "Gagal membuat transaksi Midtrans.",
                },
                { status: response.status || 400 }
            );
        }

        return NextResponse.json({
            success: true,
            token: data.token,
            redirect_url: data.redirect_url,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Terjadi kesalahan server Midtrans." },
            { status: 500 }
        );
    }
}