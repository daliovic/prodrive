const driverEmailWithTokenTemplate = data => {
  let emailBody;
  if (data.password) {
    emailBody = `
    <div>
    l'entreprise <b>${data.companyName}</b> vous a inscrit sur la
    platforme Prodrive pour passer un test d'habilitation au métier de chauffeur livreur.
    <br>
    Notez le  code de validation temporaire et cliquez sur le lien 
    pour débuter le test . 
    <br>
    Bon courage 
    <br>
    <br>
    <center>
    <a style="display: block;
    width: 115px;
    height: 25px;
    background: #4E9CAF;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    line-height: 25px;" 
    href="${process.env.APP_DRIVER_HOST}?token=${data.token}&email=${data.email}">Connexion </a> 
    </center>
    <br> 
    <br>
      votre compte : <b>${data.email}</b><br>
      mot de passe :<b>${data.password}</b> <br>
      date de debut : <b>${new Date(data.creationDate).toLocaleDateString('fr')}</b><br>
      code de validation temporaire : <b>${data.token}</b>
      <br> votre code est valable pour 4 heures a partir de  <b>${new Date().toLocaleDateString('fr')}  ${new Date().toLocaleTimeString('fr')}</b>
  </div> `;
  } else {
    emailBody = `
    <div>
    l'entreprise <b>${data.companyName}</b> a reactiver  votre  inscrit sur la
    platforme Prodrive pour passer un test d'habilitation au métier de chauffeur livreur.
    <br>
    Notez le  code de validation temporaire et cliquez sur le lien 
    pour débuter le test . 
    <br>
    Bon courage 
    <br>
    <br>
    <center>
    <a style="display: block;
    width: 115px;
    height: 25px;
    background: #4E9CAF;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    line-height: 25px;" 
    href="${process.env.APP_DRIVER_HOST}?token=${data.token}&email=${data.email}">Connexion </a> 
    </center>
    <br> 
    <br>
      votre compte : <b>${data.email}</b><br>
      mot de passe :<b>l'ancien mot de passe</b> <br>
      date de debut : <b>${new Date(data.creationDate).toLocaleDateString('fr')}</b><br>
      code de validation temporaire : <b>${data.token}</b>
      <br> votre code est valable pour 4 heures a partir de  <b>${new Date().toLocaleDateString('fr')}  ${new Date().toLocaleTimeString('fr')}</b>
  </div> `;
  }

  // href="${process.env.API_HOST}/verify/${data._id}?token=${data.token}&email=${data.email}">Connexion </a>
  return emailBody;
};

const transporterEmailWithAccountParamsTemplate = data => {
  const emailBody = `
  <div>
   vous a inscrit sur la platforme Prodrive 
   vous pouvez commencer a utilisé la platforme.
  <br>
  Votre abonnement commencé à partir de : <b>${new Date(data.startDate).toLocaleDateString('fr')}</b>. 
   jusqu'à <b>${new Date(data.endDate).toLocaleDateString('fr')}</b>
  <br>
  <br> 
  <br>
    votre compte : <b>${data.email}</b><br>
    mot de passe :<b>${data.password}</b> <br>

  <br>
  <br>
  <center>
  <a style="display: block;
  width: 115px;
  height: 25px;
  background: #4E9CAF;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  line-height: 25px;" 
  href="${process.env.APP_TRANSPORTER_HOST}">Connexion </a> 
  </center>
</div> `;
  return emailBody;
};
const sendTrasporterEmailDriverValidationTemplate = data => {
  const emailBody = `<p>Hi , <br> the user <b>${data.driverData.name.toUpperCase()} ${data.driverData.lastName} </b> with driving  <b>${
    data.driverData.drivingLicenseNumber
  }  </b>Licenece  has finished the exam successfully  </p>
  <center>
  <a style="display: block;
  width: 115px;
  height: 25px;
  background: #4E9CAF;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  line-height: 25px;" 
  href="${process.env.API_HOST}/validateExam?emailDriver=${data.driverData.email}">send certif</a>
  </center>`;
  return emailBody;
};

export { driverEmailWithTokenTemplate, transporterEmailWithAccountParamsTemplate, sendTrasporterEmailDriverValidationTemplate };
