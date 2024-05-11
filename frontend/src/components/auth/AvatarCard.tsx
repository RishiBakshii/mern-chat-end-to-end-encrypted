type PropTypes = {
  avatar: string;
};

export const AvatarCard = ({ avatar }: PropTypes) => {
  return (
    <img
      className="w-20 h-20 rounded-full object-cover"
      src={avatar}
      alt="avatar-image"
    />
  );
};
