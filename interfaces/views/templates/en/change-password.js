module.exports = (message) => ` 
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

 </head> 
 <body>  

				<h2 style="color: #767E80; margin: 0; text-align: center; background-color: #ECF0F1; padding: 20px; font-wieght: bold; text-transform: uppercase;">${process.env.HOSTNAME}</h2> 
		
		
<br>
<br>
	<div style="padding: 0 40px;">
		<h2 style="color: #000000; margin-top: 0;">Changed your password</h2> 
<h3 style="color: #767E80; margin: 0; font-weight:normal;">Your password has been changed successfully.</h3>
<br>
<br>
<h3 style="color: #767E80; margin: 0; font-weight:normal;">If it wasn't you, be sure to reset your password, as it could be someone else changed your password.<br /><br />Thanks,<br />${process.env.HOSTNAME} Team</h3>
<br>
<br>
<hr style="display: block; width: 100%;"/>
</div>

 </body>
</html>
`;