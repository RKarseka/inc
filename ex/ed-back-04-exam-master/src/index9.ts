import bcrypt from "bcryptjs";


const run = async () => {
  const hash = await bcrypt.hash('12345', "$2a$10$r3ZkRK.LvdRbbW26VFzZ8.")
  console.log(hash)
}

run()

/*
 У вас есть фиксированная соль: "$2a$10$r3ZkRK.LvdRbbW26VFzZ8."
 Получите хэш пароля 12345 (строка 4) с указанной солью и укажите этот хэш в качестве ответа
 $2a$10$r3ZkRK.LvdRbbW26VFzZ8.TT01gSHr1MKhzR0TM0FnLxxHJ9cEeYa
pass
*/