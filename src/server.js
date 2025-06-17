import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js'
import { favoritesTable } from './db/schema.js';
import { eq, and } from 'drizzle-orm';

const app = express();
const PORT = ENV.PORT || 8001;

//middlewares
app.use(express.json())



// apis 
app.get('/', (req, res) => {
    res.send('helloooo')
})

app.get('/api/health', (req, res) => {
    res.status(200).json({success:true})
})



//favorites fetch
app.get('/api/favorites/:userId', async (req, res) => {
    try{
        const {userId} = req.params;

        const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

        res.status(200).json(userFavorites)
    }
    catch(err){
        res.send(err)
    }
})

//favorite nemeh
app.post('/api/favorites', async (req, res) => {
    try{
        const { userId, recipeId, title, image, cookTime, servings } = req.body

        if(!userId || !recipeId || !title){
            return res.status(400).json({error: "Missing required fields."})
        }

        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        })
        .returning();

        res.status(201).json(newFavorite[0]);

    }catch(err){
        console.log("field nemhed alda garla.")
        res.send(err)
    }
})



//favorite ustgah
app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
    try{
        const {userId, recipeId} = req.params
        const recipeIdInt = parseInt(recipeId);

        if (isNaN(recipeIdInt)) {
            return res.status(400).json({ error: "Invalid recipe ID" });
        }
        console.log(recipeIdInt);

        await db
        .delete(favoritesTable)
        .where(
            and(
            eq(favoritesTable.userId, userId),
            eq(favoritesTable.recipeId, recipeIdInt)
            )
        );
        res.status(200).json({ message: "Favorite deleted successfully."})

    }
    catch(err){
        console.log('Error removing a favorite.')
        // res.status(500).json({ error: "Something went wrong."})
        res.send(err);
    }
})



app.listen(PORT, (req, res) => {
    console.log(`App backend ${PORT} aslaa.`)
})