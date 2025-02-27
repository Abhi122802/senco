import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials

const SUPABASE_URL = 'https://dwiafavpilffqntmgjdp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aWFmYXZwaWxmZnFudG1namRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjM2MjQsImV4cCI6MjA1NTY5OTYyNH0.8sAB62yXDN6ATsygcAAEO2HC7Ho5RCL9binmIuVpBwk';


// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch users from the 'users' table
const fetchUsers = async () => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("userid, email, phoneno, role, createdat"); // Selecting specific columns
        
        if (error) throw error; // Handle errors
        
        console.log("Fetched Users:", data); // Log the user data
        return data; // Return data for further use
    } catch (err) {
        console.error("Error fetching users:", err.message);
        return null; // Return null if error occurs
    }
};

// Call the function to fetch users
fetchUsers();

export default supabase;
