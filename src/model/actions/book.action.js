import { Book } from "../orms";



export const _publishBook = ({ name, file, text, userId }) => new Promise(resolve => {
  Book.findOne({ where: { name}}).then(book => {
    if(!!book) return resolve({ scs: false, msg: 'That title of book already exists'})

    if(!!text)
      return Book.create({ name, matter: text, userId}).then(() => resolve({ scs: true, msg: 'Book Published!' }))

    
  })
})