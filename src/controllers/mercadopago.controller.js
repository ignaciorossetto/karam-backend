import __dirname from "../utils.js";
import mercadopago from 'mercadopago'

mercadopago.configure({
    access_token: "TEST-8125028252532334-111311-2cedcea370aeadf162b1b5f60914673f-1238153828"
  });

export const createPreference = (req, res)=>{
    
    const bodyProducts = req.body
    let products = []

    bodyProducts?.forEach((item)=>{
        products.push({
            title: item.name,
            unit_price: item.price,
            quantity: item.quantity
        })
    })
    

      let preference = {
        items: products,
        back_urls: {
			"success": "http://localhost:3000/paymentresult",
			"failure": "http://localhost:3000/paymentresult/",
			"pending": "http://localhost:3000/paymentresult/"
		},
		auto_return: "approved",
    notification_url: "http://localhost:5000/api/mercadopago/webhook"
      };
      
      mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res.json({
				id: response.body.id,
        other: response.body
			})
        })
        .catch(function (error) {
          console.log(error);
        });
}

export const notification = (req,res)=>{
    console.log(req);
    res.status(200).send('OK')
  }
  