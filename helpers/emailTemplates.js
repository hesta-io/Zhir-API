function passwordResetTemplate(url) {
	return `
    <!DOCTYPE html>
    <html>
    
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>ژیر | گۆرینی تێپەرەوشە</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/font-face.css">
      <style type="text/css">
        @media screen {
            @font-face {
                font-family: Vazir;
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.eot');
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.eot?#iefix') format('embedded-opentype'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.woff2') format('woff2'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.woff') format('woff'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.ttf') format('truetype');
                font-weight: normal;
            }
              
            *{
                font-family: 'Vazir' !important;
            }
        }
                /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
        *{
            font-family: 'Vazir' !important;
        }
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%;
          /* 1 */
          -webkit-text-size-adjust: 100%;
          /* 2 */
        }
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
    
    
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
    
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
    
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          direction: rtl;
          text-align: right;
        }
        table {
          border-collapse: collapse !important;
        }
    
        a {
          color: #1a82e2;
        }
    
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
      </style>
    
    </head>
    
    <body style="background-color: #e9ecef;" direction="rtl">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px;">
                  <a href="https://zhir.io" target="_blank" style="display: inline-block;">
                    <img src="https://zhir.io/black-logo.png" alt="Logo" border="0" style="display: block; width: 100px; min-width: 48px;">
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Vazir', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;text-align:right;">گۆرینی تێپەرەوشە</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;text-align:right;">
                  <p style="margin: 0;">بۆ گۆرینی تێپەرەوشە کرتە لەو دوگمەیەی خوارەوە بکە ،گەر تۆ داواکاریەکەت نەناردوە دەتوانیت ئەم نامەیە بسریتەوە</p>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#292929" style="border-radius: 6px;">
                              <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">گۆرینی تێپەرەوشە</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;text-align:right;">
                  <p style="margin: 0;">گەر کرتەکردن کارناکات دەتوانیت ئەم بەستەرەی خوارەوە کۆی بکەیت و بە وێبگەرەکەت راستەوخۆ پێیبگەیت</p>
                  <p style="margin: 0;"><a href="${url}" target="_blank">${url}</a></p>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf; text-align:right;">
                  <p style="margin: 0;">دەستەی برێوبەرایەتی<br> ژیر</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}
function activateAccountTemplate(url) {
	return `
    <!DOCTYPE html>
    <html>
    
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>ژیر | کاراکردنی هەژمار</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/font-face.css">
      <style type="text/css">
        @media screen {
            @font-face {
                font-family: Vazir;
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.eot');
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.eot?#iefix') format('embedded-opentype'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.woff2') format('woff2'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.woff') format('woff'),
                     url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v24.2.0/dist/Vazir.ttf') format('truetype');
                font-weight: normal;
            }
              
            *{
                font-family: 'Vazir' !important;
            }
        }
                /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
        *{
            font-family: 'Vazir' !important;
        }
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%;
          /* 1 */
          -webkit-text-size-adjust: 100%;
          /* 2 */
        }
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
    
    
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
    
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
    
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          direction: rtl;
          text-align: right;
        }
        table {
          border-collapse: collapse !important;
        }
    
        a {
          color: #1a82e2;
        }
    
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
      </style>
    
    </head>
    
    <body style="background-color: #e9ecef;" direction="rtl">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px;">
                  <a href="https://zhir.io" target="_blank" style="display: inline-block;">
                    <img src="https://zhir.io/black-logo.png" alt="Logo" border="0" style="display: block; width: 100px; min-width: 48px;">
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Vazir', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;text-align:right;">کاراکردنی هەژمار</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;text-align:right;">
                  <p style="margin: 0;">بۆ کاراکردنی هەژمارەکەت کرتە لەم بەستەرەی خوارەوە بکە</p>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#292929" style="border-radius: 6px;">
                              <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">کاراکردنی هەژمار</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;text-align:right;">
                  <p style="margin: 0;">گەر کرتەکردن کارناکات دەتوانیت ئەم بەستەرەی خوارەوە کۆی بکەیت و بە وێبگەرەکەت راستەوخۆ پێیبگەیت</p>
                  <p style="margin: 0;"><a href="${url}" target="_blank">${url}</a></p>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Vazir', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf; text-align:right;">
                  <p style="margin: 0;">دەستەی برێوبەرایەتی<br> ژیر</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

module.exports = {
	passwordResetTemplate,
	activateAccountTemplate,
};
