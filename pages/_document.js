import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    render(){
        return(
            <Html lang='en'>
               <Head>
                   <meta name="description" content="Pet's Service Center"/>
                   <link className="icon" rel="icon" href="https://res.cloudinary.com/comsats-university-lahore/image/upload/v1660334023/Rehbar%20Pet%27s%20Clinic/WhatsApp_Image_2022-05-19_at_10.06.20_PM_ijqpbr.jpg" />
                   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
                   <script src="https://code.jquery.com/jquery-3.6.0.slim.min.js" async></script>
                   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" async></script>
                   <script src="https://kit.fontawesome.com/d1b2a6c089.js" async></script>
                   <script src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYMENT_CLIENT_ID}`} async></script>
                   <script src="https://js.stripe.com/v3/" async></script>
                   <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" async></script>
                   <script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" async></script>
               </Head>
               <body>
                    <Main/>
                    <NextScript/>
               </body>
            </Html>
        )
    }
}

export default MyDocument