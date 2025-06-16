
console.log('tipoMaterial.controller.js cargado')

import { Router } from 'express'
import {
    findAll,
    findOne,
    add,
    update,
    remove,
    sanitizeTipoMaterialInput
} from '../controllers/tipoMaterial.controller.js'

const router = Router()

router.get('/', findAll)
/* router.get('/:id', findOne)
router.post('/', sanitizeTipoMaterialInput, add)
router.put('/:id', sanitizeTipoMaterialInput, update)
router.patch('/:id', sanitizeTipoMaterialInput, update)
router.delete('/:id', remove)
 */
export default router
