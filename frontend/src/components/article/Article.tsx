// Define an interface for an Article object
export interface Article {
    _id: string; // The unique identifier for the article, typically a string representing an ID from the database
    JournalName: string; // The name of the journal in which the article is published
    Authors: string[]; // An array of strings representing the authors of the article
    PubYear: number; // The year the article was published, represented as a number
    Volume: string; // The volume of the journal where the article appears
    Number: string; // The issue number of the journal where the article appears
    Pages: string; // The page range of the article in the journal, typically a string (e.g., "123-130")
    Link: string; // A URL link to the article or its source
    SEPractice: string; // The software engineering practice the article relates to (e.g., Agile, TDD, etc.)
    Summary: string; // A summary or abstract of the article's content
    Perspective: string; // The perspective taken in the article (e.g., supportive, neutral, or rejecting certain practices)
    Impressions: number; // The number of impressions or views the article has received
    Status: string; // The current status of the article (e.g., published, draft, under review)
    Reason: string; //the reason that this is the current status of the article
    DOE: Date; // The date of entry (DOE), representing when the article was added to the system
}
