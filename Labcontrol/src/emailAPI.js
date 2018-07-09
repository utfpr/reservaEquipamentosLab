import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.smtp2go.com/v3/'
})

export function sendEmail (to, subject, textBody, htmlBody) {
  let email = {
    'api_key': 'api-D9A1DF38838611E8BBEBF23C91C88F4E',
    'to': to,
    'sender': 'LabControl <labcontrol@utfpr.edu.br>',
    'subject': subject,
    'text_body': textBody,
    'html_body': htmlBody,
    'custom_headers': [
      {
        'header': 'Reply-To',
        'value': 'no-reply'
      }
    ]
  }
  HTTP.post('email/send', email).then(response => {
    return response.status
  })
}
