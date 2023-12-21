const pg = require('pg')
const client = new pg.Client('postgres://localhost/icecream_shop')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.get('/', (req, res, next) => {
    res.send("Hello Booski")
})

//GET all flavors
app.get('/api/flavors', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM flavors;
        `
    const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//GET one flavor
app.get('/api/flavors/:id', async (req,res,next) => {
    try {
        console.log(req.params.id)

        const SQL = `
        SELECT * FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        
        if(!response.rows.length){
            next({
                Name: "id error",
                message: `flavor with id of ${req.params.id} not found`
            })
        } else{
        res.send(response.rows[0])
        }
    } catch (error) {
        next(error)
    }
})

//Delete a flavor
app. delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        console.log(response)
        res.sendStatus(204)

    } catch (error) {
        next(error)
    }
})


app.use((error, req, res, next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req, res, next)=> {
    res.send("no such route exist")
})

const start = async () => {
    await client.connect()
    console.log('connected to database')
    const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)   
        );
        INSERT INTO flavors (name) VALUES ('Chocolate');
        INSERT INTO flavors (name) VALUES ('Vanilla');
        INSERT INTO flavors (name) VALUES ('Coffee');
        INSERT INTO flavors (name) VALUES ('Cake');
        INSERT INTO flavors (name) VALUES ('Rockyroad');
        INSERT INTO flavors (name) VALUES ('Strawberry');
    `
        await client.query(SQL)
        console.log('Table Created')

        const port = process.env.PORT || 3009

        app.listen(port, () => {
            console.log(`Server listeing on port ${port}`)
        })


}

start()

