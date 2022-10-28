import bcrypt from 'bcryptjs'

const run = async () => {
  const passwords = [
    '123',
    'qwerty',
    'password',
    'superpassword',
    'anykibeniky',
    'jyvebelarus'
  ]
    const hs= "$2a$10$Vn9PcYBKm2y0GeJK.Kzn6.0TKig9rHLd0ssxfijvKidM4OLwlr0jS"

  passwords.forEach(async (password) => {
    const result =  await bcrypt.compare(password, hs)

    if (result) {
      console.log('correct password: ', password)
    }
  })
}

run()

/*
 Пользователь украл из БД хэш пароля и пытается перебором подорать пароль.
 Помогите ему увидеть в консоли (строка 17) правильный пароль, дописав 14 строку.
 Украденный хэш = "$2a$10$Vn9PcYBKm2y0GeJK.Kzn6.0TKig9rHLd0ssxfijvKidM4OLwlr0jS"

 В качестве ответа дайте правильный пароль

 superpassword
 pass
*/