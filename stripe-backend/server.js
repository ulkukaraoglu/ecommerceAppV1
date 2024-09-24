const express = require('express');
const stripe = require('stripe')('sk_test_51Q0Hu902Wpvsnd0ph9fqzwPp0L2U4lxG3fWdonNogbcjrJV1pGSQ4juleiNSxaA9Ib1X5sQp3NqJCOWa5OTUuzrw008iuAoNCI');
const app = express();

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Frontend'den gelen ödeme tutarı

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Tutar kuruş cinsinden olmalı
            currency: 'usd',
            description: 'Test Ürünü Açıklaması',
            payment_method_options: {
                card: {
                    request_three_d_secure: 'any',
                },
            },
            metadata: {
                merchant_display_name: 'Test İşletmesi', // Varsayılan bir işletme adı
            },
        });

        console.log('Payment Intent:', paymentIntent); // Payment Intent'ı kontrol

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error.message); // Hataları kontrol edin
        res.status(500).send({ error: error.message });
    }

});


app.listen(4242, () => console.log('Backend çalışıyor: http:// 192.168.1.109:4242'));
