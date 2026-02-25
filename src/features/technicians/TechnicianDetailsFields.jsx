import TechnicianNameContactFields from './TechnicianNameContactFields';
import TechnicianCivilIdNationalityFields from './TechnicianCivilIdNationalityFields';
import TechnicianGenderStatusFields from './TechnicianGenderStatusFields';
import TechnicianRatingField from './TechnicianRatingField';
import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianDetailsFields({
  register,
  errors,
  validationRules,
  isEdit,
}) {
  return (
    <>
      <h3 className={styles.sectionTitle}>Technician Details</h3>
      <TechnicianNameContactFields
        register={register}
        errors={errors}
        validationRules={validationRules}
      />
      <TechnicianCivilIdNationalityFields
        register={register}
        errors={errors}
        validationRules={validationRules}
      />
      <TechnicianGenderStatusFields
        register={register}
        errors={errors}
        validationRules={validationRules}
      />
      <TechnicianRatingField
        register={register}
        errors={errors}
        validationRules={validationRules}
        isEdit={isEdit}
      />
    </>
  );
}

export default TechnicianDetailsFields;
