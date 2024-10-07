export interface Article {
    _id: string;
    JournalName: string,
    Authors: string[],
    PubYear: number,
    Volume: string,
    Number: string,
    Pages: string,
    Link: string,
    SEPractice: string,
    Summary: string,
    Perspective: string,
    Impressions: number,
    Status: string,
    DOE: Date
}