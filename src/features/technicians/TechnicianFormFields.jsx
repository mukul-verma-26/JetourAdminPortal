import TechnicianPhotoSection from './TechnicianPhotoSection';
import TechnicianDetailsFields from './TechnicianDetailsFields';

function TechnicianFormFields({
  register,
  errors,
  validationRules,
  image,
  onImageClick,
  onFileChange,
  fileInputRef,
}) {
  return (
    <>
      <TechnicianPhotoSection
        image={image}
        onImageClick={onImageClick}
        onFileChange={onFileChange}
        fileInputRef={fileInputRef}
        error={errors.image?.message}
      />
      <TechnicianDetailsFields
        register={register}
        errors={errors}
        validationRules={validationRules}
      />
    </>
  );
}

export default TechnicianFormFields;
