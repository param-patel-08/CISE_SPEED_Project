import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
import axios from "axios";  // Import axios


interface ArticlesInterface {
  Title: string;
  Authors: string[];
  Source: string;
  PubYear: number;
  Status: string;
  SEPractice: string;
  Perspective: string;
  Impressions: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "Title", label: "Title" },
    { key: "Authors", label: "Authors" },
    { key: "Source", label: "Source" },
    { key: "PubYear", label: "Publication Year" },
    { key: "SEPractice", label: "Software Engineering Practice"},
    { key: "Perspective", label: "Perspective" },
    { key: "Impressions", label: "Impressions"}
  ];

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>
      <SortableTable headers={headers} data={articles} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
  // Map the data to ensure all articles have consistent property names
  let responce = await axios.get("http://localhost:3001/articles");
  let data = responce.data;

  const articles = data.map((article: ArticlesInterface) => ({
  Title: article.Title,
  Authors: article.Authors.join(", "),
  Source: article.Source,
  PubYear: article.PubYear,
  SEPractice: article.SEPractice,
  Perspective: article.Perspective,
  Impressions: article.Impressions
}));



  return {
    props: {
      articles,
    },
  };
};

export default Articles;
