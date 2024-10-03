import React from "react";

export default function Home() {
  return (
    <div className="container">
      <h1>Software Practice Empirical Evidence Database (SPEED)</h1>

      {/* Brief description of the product */}
      <p>
        The Software Practice Empirical Evidence Database (SPEED) is a searchable 
        database designed to help software engineers make evidence-based decisions 
        regarding software engineering practices. SPEED aggregates and presents 
        empirical evidence from various published academic research papers to validate 
        claims about different SE practices. Practitioners, researchers, and students 
        can easily access, search, and filter the database to find research studies 
        that support or refute claims, helping users determine the effectiveness of 
        specific software engineering methods and practices.
      </p>

      {/* Description of its purpose */}
      <p>
        SPEED serves as a central repository that compiles, organizes, and filters 
        research articles, providing users with summarized evidence about claims related 
        to practices like Test-Driven Development, Continuous Integration, Pair Programming, 
        and more. By simplifying access to peer-reviewed studies, SPEED empowers engineers 
        to make well-informed decisions based on evidence, rather than speculation or anecdotal 
        experience.
      </p>
    </div>
  );
}
