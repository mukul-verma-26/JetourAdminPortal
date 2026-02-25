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
  isEdit,
}) {
  return (
    <>
      <TechnicianPhotoSection
        image={image}
        onImageClick={onImageClick}
        onFileChange={onFileChange}
        fileInputRef={fileInputRef}
        error={errors.image?.message}
        isEdit={isEdit}
      />
      <TechnicianDetailsFields
        register={register}
        errors={errors}
        validationRules={validationRules}
        isEdit={isEdit}
      />
    </>
  );
}

export default TechnicianFormFields;
