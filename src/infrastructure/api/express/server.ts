require('module-alias/register')
import { app } from './app'
import { connect } from '@infrastructure/db/mongodb';
connect()
app.listen(process.env.PORT || 3005, async () => { 
    console.log(`Server is running on port ${process.env.PORT || 3005}` ) 
})