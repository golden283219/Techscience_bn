import { Op } from "sequelize";
import { compareSync } from "bcrypt";
import { resetMailSender } from "../../middlewares/mailHandler";
import { makeToken, verifyResetToken } from "../../middlewares/tokenHandler";
import { 
  User, 
  Membership, 
  Account, 
  Role 
} from '../orms'

var aws = require('aws-sdk');

aws.config.update({
    accessKeyId: 'AKIASPKE2A33XV7JVTKM',
    secretAccessKey: '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',
    region: 'us-east-2'
});

var ses = new aws.SES({region: 'us-east-2'});

export const _signin = ({ username, password }) => new Promise((resolve, reject) => {
  User.findOne({
    where: {
      username
    },
    include: Account,
    nest: true
  }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'Invalid Credential!' })

    if (!compareSync(password, user.password))
      return resolve({ scs: false, msg: 'Invalid Credential!' })

    if (!user.approved)
      return resolve({ scs: false, msg: 'You are not approved yet!' })

    if (!!user.lockedOut)
      return resolve({ scs: false, msg: 'You are locked out!' })

    const token = makeToken({
      payload: {
        ...user.dataValues,
        account: { ...user.dataValues.account.dataValues}
      }
    })

    return resolve({ scs: true, msg: `Success! Hi ${user.username}`, token})
  })
})

export const _signup = data => new Promise((resolve, reject) => {
  const { firstname, lastname, email, username, password, membershipId, accountId } = data
  User.findOne({ where: { email } }).then(user => {
    if (!!user)
      return resolve({ scs: false, msg: 'That email already taken!' })

    User.findOne({ where: { username } }).then(user => {
      if (!!user)
        return resolve({ scs: false, msg: 'That username already taken!' })

      User.create({ firstname, lastname, email, username, password, membershipId, accountId, approved: true }).then(user => {
        return resolve({ scs: true, msg: 'Sign up Success!', user: user.dataValues })
      })
    })
  })
})

export const _changePassword = ({ id, password, newPassword }) => new Promise((resolve, reject) => {
  User.findByPk(id)
    .then(user => {
      if (!user)
        return resolve({ scs: false, msg: 'We cant recognize you!' })

      if (!compareSync(password, user.password))
        return resolve({ scs: false, msg: 'Please provide right password' })

      user.password = newPassword
      user.save()
      return resolve({ scs: true, msg: 'Password Changed Successfully!' })
    })
})

export const _forgotPassword = ({ email }) => new Promise(resolve => {
  User.findOne({ where: { email}}).then( user => {
    if(!user)
      return resolve({ scs: false, msg: 'User with this Email Not Exist.' })

    const resetToken =  makeToken({
      payload: { email: user.email },
      expiresIn: '1h'
    })

    user.resetToken = resetToken
    user.save()
    console.log('resetToken', resetToken)

    /*
    resetMailSender({ receiver: user.email, resetToken })
     .then(res =>  resolve({ scs: true, msg: 'We sent an email to you with reset link.' + res }))
     .catch(err => resolve({ scs: false, msg: 'Email Error!!'+err }))
    */
    //resetMailSender({ receiver: user.email, resetToken })
    //sendMail('jxun6793@gmail.com', 'Password Reset', 'Password Reset').then(()=>{
    //    });
    const subject = `
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <!--[if !mso]><!-->
        <style type="text/css">
          @font-face {
                    font-family: 'flama-condensed';
                    font-weight: 100;
                    src: url('http://assets.vervewine.com/fonts/FlamaCond-Medium.eot');
                    src: url('http://assets.vervewine.com/fonts/FlamaCond-Medium.eot?#iefix') format('embedded-opentype'),
                          url('http://assets.vervewine.com/fonts/FlamaCond-Medium.woff') format('woff'),
                          url('http://assets.vervewine.com/fonts/FlamaCond-Medium.ttf') format('truetype');
                }
                @font-face {
                    font-family: 'Muli';
                    font-weight: 100;
                    src: url('http://assets.vervewine.com/fonts/muli-regular.eot');
                    src: url('http://assets.vervewine.com/fonts/muli-regular.eot?#iefix') format('embedded-opentype'),
                          url('http://assets.vervewine.com/fonts/muli-regular.woff2') format('woff2'),
                          url('http://assets.vervewine.com/fonts/muli-regular.woff') format('woff'),
                          url('http://assets.vervewine.com/fonts/muli-regular.ttf') format('truetype');
                  }
                .address-description a {color: #000000 ; text-decoration: none;}
                @media (max-device-width: 480px) {
                  .vervelogoplaceholder {
                    height:83px ;
                  }
                }
        </style>
        <!--<![endif]-->
        <!--[if (gte mso 9)|(IE)]>
          <style type="text/css">
              .address-description a {color: #000000 ; text-decoration: none;}
              table {border-collapse: collapse ;}
          </style>
          <![endif]-->
      </head>
      
      <body bgcolor="#e1e5e8" style="margin-top:0 ;margin-bottom:0 ;margin-right:0 ;margin-left:0 ;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;background-color:#e1e5e8;">
        <!--[if gte mso 9]>
      <center>
      <table width="600" cellpadding="0" cellspacing="0"><tr><td valign="top">
      <![endif]-->
        <center style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#e1e5e8;">
          <div style="max-width:600px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
            <table align="center" cellpadding="0" style="border-spacing:0;font-family:'Muli',Arial,sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;">
              <tbody>
                <tr>
                  <td align="center" class="vervelogoplaceholder" height="143" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;height:143px;vertical-align:middle;" valign="middle"><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22160%22%2C%22height%22%3A34%2C%22alt_text%22%3A%22Verve%20Wine%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/79d8f4f889362f0c7effb2c26e08814bb12f5eb31c053021ada3463c7b35de6fb261440fc89fa804edbd11242076a81c8f0a9daa443273da5cb09c1a4739499f.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="#" target="_blank"><img alt="Verve Wine" height="34" src="https://marketing-image-production.s3.amazonaws.com/uploads/79d8f4f889362f0c7effb2c26e08814bb12f5eb31c053021ada3463c7b35de6fb261440fc89fa804edbd11242076a81c8f0a9daa443273da5cb09c1a4739499f.png" style="border-width: 0px; width: 160px; height: 34px;" width="160"></a></span></td>
                </tr>
                <!-- Start of Email Body-->
                <tr>
                  <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#ffffff;">
                    <!--[if gte mso 9]>
                          <center>
                          <table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
                          <![endif]-->
                    <table style="border-spacing:0;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" class="inner" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;" valign="middle"><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22255%22%2C%22height%22%3A93%2C%22alt_text%22%3A%22Forgot%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><img alt="Forgot Password" class="banner" height="93" src="https://marketing-image-production.s3.amazonaws.com/uploads/35c763626fdef42b2197c1ef7f6a199115df7ff779f7c2d839bd5c6a8c2a6375e92a28a01737e4d72f42defcac337682878bf6b71a5403d2ff9dd39d431201db.png" style="border-width: 0px; margin-top: 30px; width: 255px; height: 93px;" width="255"></span></td>
                        </tr>
                        <tr>
                          <td class="inner contents center" style="padding-top:15px;padding-bottom:15px;padding-right:30px;padding-left:30px;text-align:left;">
                            <center>
                              <p class="h1 center" style="Margin:0;text-align:center;font-family:'flama-condensed','Arial Narrow',Arial;font-weight:100;font-size:30px;Margin-bottom:26px;">Forgot your password?</p>
                              <!--[if (gte mso 9)|(IE)]><![endif]-->
      
                              <p class="description center" style="font-family:'Muli','Arial Narrow',Arial;Margin:0;text-align:center;max-width:320px;color:#a1a8ad;line-height:24px;font-size:15px;Margin-bottom:10px;margin-left: auto; margin-right: auto;"><span style="color: rgb(161, 168, 173); font-family: Muli, &quot;Arial Narrow&quot;, Arial; font-size: 15px; text-align: center; background-color: rgb(255, 255, 255);">That's okay, it happens! Click on the button below to reset your password.</span></p>
                              <!--[if (gte mso 9)|(IE)]><br>&nbsp;<![endif]--><span class="sg-image" data-imagelibrary="%7B%22width%22%3A%22260%22%2C%22height%22%3A54%2C%22alt_text%22%3A%22Reset%20your%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/c1e9ad698cfb27be42ce2421c7d56cb405ef63eaa78c1db77cd79e02742dd1f35a277fc3e0dcad676976e72f02942b7c1709d933a77eacb048c92be49b0ec6f3.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D"><a href="${process.env.APP_HOST}/reset_password/${resetToken}" target="_blank"><img alt="Reset your Password" height="54" src="https://marketing-image-production.s3.amazonaws.com/uploads/c1e9ad698cfb27be42ce2421c7d56cb405ef63eaa78c1db77cd79e02742dd1f35a277fc3e0dcad676976e72f02942b7c1709d933a77eacb048c92be49b0ec6f3.png" style="border-width: 0px; margin-top: 30px; margin-bottom: 50px; width: 260px; height: 54px;" width="260"></a></span>
                              <!--[if (gte mso 9)|(IE)]><br>&nbsp;<![endif]--></center>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                          </td></tr></table>
                          </center>
                          <![endif]-->
                  </td>
                </tr>
                <!-- End of Email Body-->
                <!-- whitespace -->
                <tr>
                  <td height="40">
                    <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
      
                    <p>&nbsp;</p>
                  </td>
                </tr>
                <!-- Social Media -->
                <tr>
                  <td style="padding-top:0;padding-bottom:0;padding-right:30px;padding-left:30px;text-align:center;Margin-right:auto;Margin-left:auto;">
                    <center>
                      <p style="font-family:'Muli',Arial,sans-serif;Margin:0;text-align:center;Margin-right:auto;Margin-left:auto;font-size:15px;color:#a1a8ad;line-height:23px;">Problems or questions? Call us at
                        <nobr><a class="tel" href="tel:2128102899" style="color:#a1a8ad;text-decoration:none;" target="_blank"><span style="white-space: nowrap">212.810.2899</span></a></nobr>
                      </p>
      
                      <p style="font-family:'Muli',Arial,sans-serif;Margin:0;text-align:center;Margin-right:auto;Margin-left:auto;font-size:15px;color:#a1a8ad;line-height:23px;">or email <a href="mailto:hello@vervewine.com" style="color:#a1a8ad;text-decoration:underline;" target="_blank">hello@vervewine.com</a></p>
      
                      <p style="font-family:'Muli',Arial,sans-serif;Margin:0;text-align:center;Margin-right:auto;Margin-left:auto;padding-top:10px;padding-bottom:0px;font-size:15px;color:#a1a8ad;line-height:23px;">?? Verve Wine <span style="white-space: nowrap">24 ???Hubert S???t???</span>, <span style="white-space: nowrap">Ne???w Yor???k,</span> <span style="white-space: nowrap">N???Y 1???0013</span></p>
                    </center>
                  </td>
                </tr>
                <!-- whitespace -->
                <tr>
                  <td height="40">
                    <p style="line-height: 40px; padding: 0 0 0 0; margin: 0 0 0 0;">&nbsp;</p>
      
                    <p>&nbsp;</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </center>
        <!--[if gte mso 9]>
      </td></tr></table>
      </center>
      <![endif]-->
      
      
      </body>
    `

    const emailParams = {
        Destination: {
            ToAddresses: [user.email],
        },
        Message: {
            Body: {
                Html: { Data: subject },
            },
            Subject: { Data: 'Password Reset' },
        },
        Source: process.env.EMAIL_USER
    };


    let sendPromise = ses.sendEmail(emailParams).promise();

    sendPromise.then( data => {
      console.log(data.MessageId);
      console.log("MAIL SENT SUCCESSFULLY!!");
      return resolve({ scs: true, msg: 'We sent an email to you with reset link.' + user.email });
    }).catch( err => {
      console.error(err, err.stack);
      console.log("FAILURE IN SENDING MAIL!!", err);
      return resolve({ scs: false, msg: 'Email Error.' });
    });

    
  })
})

export const _resetPassword = ({ newPassword, confirmPassword, resetToken }) => new Promise(resolve => {
  const email = verifyResetToken(resetToken)

  if(!email)
    return resolve({ scs: false, msg: 'Error! Invalid Token Provided!' })

  User.findOne({ where: { email}}).then(user => {
    if(!user)
      return resolve({ scs: false, msg: 'Error! Who are you?' })

    if(user.resetToken !== resetToken)
      return resolve({ scs: false, msg: 'Error! Invalid Token Provided.' })

    user.password = newPassword
    user.resetToken = null
    user.save()
    return resolve({ scs: true, msg: 'Success! Password reseted.' })
  })
})

export const _users = ({ skip, limit, order, sort, filter, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  let where = {
    ...global.parseJson(filter),
    id: {
      [Op.not]: userId
    }
  }
  if (!!isTeacher)
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3,
    }

  let orderBy = [order, sort]
  switch (order) {
    case 'fullname':
      orderBy = ['firstname', sort]
      break;

    case 'account.name':
      orderBy = [Account, 'name', sort]
      break;

    case 'role.name':
      orderBy = [Role, 'name', sort]
      break;

    default:
      break;
  }

  User.findAndCountAll({
    where,
    order: [[...orderBy]],
    offset: skip,
    limit,
    include: [Membership, Account, Role],
    nest: true
  }).then(({ count, rows }) => {
    return resolve({ users: rows, totalCount: count })
  })
})

export const _userById = id => new Promise((resolve, reject) => {
  User.findByPk(id).then(user => resolve(user))
})

export const _createUser = ({ firstname, lastname, username, email, password, roleId, accountId, membershipId, approved, lockedOut, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  User.findOne({ where: { email } }).then(user => {
    if (!!user)
      return resolve({ scs: false, msg: 'That email already taken!' })

    User.findOne({ where: { username } }).then(user => {
      if (!!user)
        return resolve({ scs: false, msg: 'That username already taken!' })

      User.create({
        firstname,
        lastname,
        email,
        username,
        password,
        membershipId,
        accountId: !isTeacher ? accountId : userAccountId,
        roleId: !isTeacher ? roleId : 3,
        approved,
        lockedOut
      }).then(user => {
        return resolve({ scs: true, msg: 'User Created!' })
      })
    })
  })
})

export const _editUser = ({ id, firstname, lastname, username, roleId, membershipId, accountId, approved, lockedOut, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  if (id === userId)
    return resolve({ scs: false, msg: 'You cant edit yourself!' })

  let where = { id }

  if (!!isTeacher) {
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3
    }

    accountId = userAccountId
    roleId = 3
  }

  User.findOne({ where }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'What are you going to edit?' })

    User.findOne({ where: { username } }).then(exist => {
      if (!!exist && user.username !== username)
        return resolve({ scs: false, msg: 'That username already exists!' })

      Membership.findByPk(membershipId).then(membership => {
        if (!membership)
          return resolve({ scs: false, msg: 'We dont have such membership!' })

        Account.findByPk(accountId).then(account => {
          if (!account)
            return resolve({ scs: false, msg: 'We dont have such account!' })

          Role.findByPk(roleId).then(role => {
            if (!roleId)
              return resolve({ scs: false, msg: 'We dont have such role!' })

            User.update({
              firstname,
              lastname,
              username,
              membershipId,
              accountId: !isTeacher ? accountId : userAccountId,
              approved,
              lockedOut,
              roleId: !isTeacher ? roleId : 3
            }, {
              where: { id }
            }).then(user => resolve({ scs: true, msg: 'User updated!' }))
          })
        })
      })
    })
  })
})

export const _deleteUser = ({ id, userId, userAccountId, isTeacher }) => new Promise((resolve, reject) => {
  if (id === userId)
    return resolve({ scs: false, msg: 'You cant delete yourself!' })

  let where = { id }

  if (!!isTeacher)
    where = {
      ...where,
      accountId: userAccountId,
      roleId: 3
    }

  User.findOne({ where }).then(user => {
    if (!user)
      return resolve({ scs: false, msg: 'What are you going to delete?' })

    user.destroy()
    return resolve({ scs: true, msg: 'User Deleted!', user: user.dataValues })
  })
})