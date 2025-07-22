"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React from "react";
import MDEditor from "@uiw/react-md-editor";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pitch, setPitch] = useState("**Hello world!!!**");
  return (
    <form action={() => {}} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textaread"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Title (Tech, Health, Education...)"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div className="container">
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
        />
        <MDEditor.Markdown source={pitch} style={{ whiteSpace: "pre-wrap" }} />
      </div>
    </form>
  );
};

export default StartupForm;
