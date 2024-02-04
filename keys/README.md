# Keys

Dear friends,

The files in this directory is required to run the Timesheet development under HTTPS protocol (it is necessary to enable some browser features) and are **for local development purposes** only. 

The KEY and PEM files are actually used by Angular Development server, if you run it like `ng serve --ssl` (so dev version of Timesheet will be accessible via https://localhost:4200/).

However, the browser will show you a security warning that connection is not trusted, or something like that, which is **fine** for self-signed certificates.

If you want browsers to trust the SSL certificates, you have to add the `ca.pem` file to `/usr/local/share/ca-certificate` (Ubuntu) or Keychan Access (MacOS).

Also, browsers like Firefox may require additional setup in order to enable support for self-made CA.
