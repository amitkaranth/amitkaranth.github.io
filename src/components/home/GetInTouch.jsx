import React from "react";

const GetInTouch = ({ heading, message, email, message2, phoneNumber }) => {
  message2 = " or call me at: "
  phoneNumber = "+1 (978)-330-0954"
  return (
    <>
      <h2 className="display-4 pb-3 text-center">{heading}</h2>
      <p className="lead text-center pb-3">
        {message}
        <a className="text-decoration-none" href={`mailto:${email}`}>{email}</a>,  
        {message2}
        <a className="text-decoration-none" href={`tel:${phoneNumber}`}>{phoneNumber}</a>.
      </p>
    </>
  );
};

export default GetInTouch;


