import React from "react";
import { useForm } from "react-hook-form";

// Define the type for the form data
interface SubmissionFormData {
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  linked_discussion: string;
}

export default function SubmissionForm() {
  // Use the interface in useForm
  const { register, handleSubmit } = useForm<SubmissionFormData>();

  const onSubmit = (data: SubmissionFormData) => {
    console.log(JSON.stringify(data)); // Process the form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} placeholder="Title" />
      <p>
        <input {...register("authors")} placeholder="Authors" />
      </p>
      <p>
        <input {...register("source")} placeholder="Source" />
      </p>
      <p>
        <input {...register("pubyear")} placeholder="Publication Year" />
      </p>
      <p>
        <input {...register("doi")} placeholder="DOI" />
      </p>

      <select {...register("linked_discussion")}>
        <option value="">Select SE practice...</option>
        <option value="TDD">TDD</option>
        <option value="Mob Programming">Mob Programming</option>
      </select>
      <input type="submit" />
    </form>
  );
}
