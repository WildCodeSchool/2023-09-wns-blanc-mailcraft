// OBSOLETE A CONSERVER POUR LE MOMENT

// import axios from "axios";
// import { ApolloError, gql, useMutation } from "@apollo/client";
// import { useTemplate } from "@/contexts/TemplateContext";

// import {
//   IListElement,
//   IZone,
//   Template,
// } from "@/types/interfaces/template/template-interfaces";
// import { useState, useEffect } from "react";
// import imageIconSrc from "@/assets/template-page/icon-image.png";
// import logoIconSrc from "@/assets/template-page/lien-de-partage.png";
// import texteIconSrc from "@/assets/template-page/icon-texte.png";
// import {
//   CREATE_TEMPLATE,
//   CREATE_ZONE,
//   CREATE_SUBZONE,
//   DELETE_TEMPLATE,
//   DELETE_OLD_SUBZONES,
//   MODIFY_TEMPLATE,
//   MODIFY_ZONE_SUBZONES,
//   DELETE_TEMPLATE_ZONES,
//   MODIFY_SUBZONE,
//   UPDATE_ZONE,
// } from "@/client/mutations/template/template-mutations";
// import { useRouter } from "next/router";

// // Template utils la plupart des fonctions seront stockées ici

// export const useTemplateUtils = () => {
//   const router = useRouter();
//   const listElements: IListElement[] = [
//     {
//       id: "module-Texte",
//       title: "Texte",
//       picture: texteIconSrc,
//     },
//     {
//       id: "module-Image",
//       title: "Image",
//       picture: imageIconSrc,
//     },
//     {
//       id: "module-Social", // en cas de bug remettre 1,2,3
//       title: "Social",
//       picture: logoIconSrc,
//     },
//   ];

//   // context
//   const {
//     template,
//     setTemplate,
//     zones,
//     setZones,
//     imgPreview,
//     setImgPreview,
//     imgPreviews,
//     setImgPreviews,
//     templateToModify,
//     setTemplateToModify,
//     oldTemplateToModify,
//     setOldSubZonesId,
//     oldSubZonesId,
//     setOldZonesId,
//     oldZonesId,
//     isModalModifyOpen,
//     setIsModalModifyOpen,
//   } = useTemplate();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [templateId, setTemplateId] = useState<number | null>(null);

//   const [createTemplate] = useMutation(CREATE_TEMPLATE, {
//     onCompleted: (data) => {
//       setTemplateId(data.createTemplate.id);
//       console.log("Template created with ID:", data.createTemplate.id);
//     },
//     onError: (error) => {
//       console.error("Error creating template:", error);
//     },
//   });

//   const [modifyTemplate] = useMutation(MODIFY_TEMPLATE, {
//     onCompleted: (data) => {
//       setTemplateId(data.modifyTemplate.id);
//       console.log("Template modified with ID:", data.modifyTemplate.id);
//     },
//     onError: (error) => {
//       console.error("Error modifying template:", error);
//     },
//   });

//   const [modifySubZone] = useMutation(MODIFY_SUBZONE, {
//     onCompleted: (data) => {
//       console.log("SubZone modified with ID:", data.modifySubZone.id);
//     },
//     onError: (error) => {
//       console.error(
//         "Error modifying subZone with ID:",
//         data.modifySubZone.id,
//         error
//       );
//     },
//   });

//   const [updateZone] = useMutation(UPDATE_ZONE, {
//     onCompleted: (data) => {
//       console.log("Zone modified");
//     },
//     onError: (error) => {
//       console.error("Error modifying zone", error);
//     },
//   });

//   const [modifyZoneSubZones, { data, loading, error }] = useMutation(
//     MODIFY_ZONE_SUBZONES,
//     {
//       onCompleted: () => {
//         console.log("New subZones created successfully");
//       },
//       onError: (error) => {
//         console.error("Error updating subZones:", error);
//       },
//     }
//   );

//   const [
//     createZone,
//     { data: zoneData, loading: zoneLoading, error: zoneError },
//   ] = useMutation(CREATE_ZONE, {
//     onCompleted: (data) => {
//       console.log("Zone created with ID:", data.createZone.id);
//     },
//     onError: (error) => {
//       console.error("Error creating zone:", error);
//     },
//   });

//   const [
//     createSubZone,
//     { data: subZoneData, loading: subZoneLoading, error: subZoneError },
//   ] = useMutation(CREATE_SUBZONE, {
//     onCompleted: (data) => {
//       console.log("SubZone created:", data.createSubZone);
//     },
//     onError: (error) => {
//       console.error("Error creating subZone:", error);
//     },
//   });

//   const [deleteTemplate] = useMutation(DELETE_TEMPLATE, {
//     onCompleted: () => {
//       console.log("Template deleted successfully");
//     },
//     onError: (error) => {
//       console.error("Error deleting template:", error);
//     },
//   });
//   const [deleteTemplateZones] = useMutation(DELETE_TEMPLATE_ZONES, {
//     onCompleted: () => {
//       console.log("Template zones have been successfully deleted ");
//     },
//     onError: (error) => {
//       console.error("Error deleting template zone:", error);
//     },
//   });
//   const [deleteOldSubZones] = useMutation(DELETE_OLD_SUBZONES, {
//     onCompleted: () => {
//       console.log("Old sub zones have been successfully deleted ");
//     },
//     onError: (error) => {
//       console.error("Error deleting old sub zones:", error);
//     },
//   });
//   const saveTemplate = async (templateStatus) => {
//     let newTemplateId;
//     try {
//       // Création du template pour récupérer l'id
//       const templateResponse = await createTemplate({
//         variables: {
//           templateData: { ...template, status: templateStatus },
//         },
//       });
//       newTemplateId = templateResponse.data.createTemplate.id;

//       // Création des zones et subzones en série pour chaque zone
//       for (const zone of zones) {
//         if (zoneHasNoValue(zone)) {
//           continue; // Si la zone est vide on ne l'a crée pas
//         }
//         const { data: zoneResponse } = await createZone({
//           variables: { templateId: newTemplateId, zoneOrder: zone.order },
//         });
//         const newZoneId = zoneResponse.createZone.id;

//         // Gestion de toutes les subzones pour la zone courante
//         for (const subZone of zone.subZones) {
//           let subZoneContent = subZone.content;
//           // Gestion de l'upload d'images si nécessaire
//           if (subZone.moduleType === "image" && subZone.content.length > 0) {
//             const formData = new FormData();
//             formData.append("file", subZone.content[0]);
//             const uploadResponse = await axios.post(
//               "http://localhost:5000/template-images-upload",
//               formData,
//               { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             subZoneContent = uploadResponse.data.url; // maj du contenu avec l'url cloudinary
//           }

//           await createSubZone({
//             variables: {
//               subZoneData: {
//                 order: subZone.order,
//                 moduleType: subZone.moduleType,
//                 content: subZoneContent,
//                 size: subZone.size,
//                 links: subZone.links,
//                 zoneId: newZoneId,
//               },
//             },
//           });
//         }
//       }
//       alert("Succès");
//       console.log(
//         "Tous les templates, zones et subzones ont été créés avec succès."
//       );
//       // resetStateAfterSuccess(); à implémenter pour reset les states après un succes
//     } catch (error) {
//       console.error(
//         "Erreur lors de la création du template ou des zones:",
//         error
//       );
//       handleCreationError(newTemplateId); // Gestion des erreurs avec passage de l'ID du template pour des actions spécifiques
//     }
//   };

//   // Fonction pour gérer l'erreur et nettoyer si nécessaire
//   const handleCreationError = async (templateId) => {
//     if (templateId) {
//       try {
//         await deleteTemplate({ variables: { templateId } });
//         console.log("Template supprimé après erreur.");
//       } catch (deleteError) {
//         console.error(
//           "Erreur lors de la suppression du template:",
//           deleteError
//         );
//       }
//     }
//     if (isModalOpen) {
//       closeModal();
//     }
//   };

//   const saveTemplateToModify = async (template, status) => {
//     const templateData = {
//       title: template.title,
//       description: template.description,
//       templateNature: template.templateNature,
//       status: status,
//     };

//     try {
//       await modifyTemplate({
//         variables: {
//           templateId: template.id,
//           templateData: templateData,
//         },
//       });

//       // Traiter chaque zone et ses sous-zones
//       let zonesToDelete = [];

//       for (const [index, zone] of template.zones.entries()) {
//         let newZoneId = zone.id;

//         if (zoneHasNoValue(zone)) {
//           if (!isTemporaryZone(zone)) {
//             zonesToDelete.push(zone.id);
//           }
//           continue;
//         }

//         if (!isTemporaryZone(zone)) {
//           await updateZone({
//             variables: {
//               zoneId: newZoneId,
//               zoneOrder: zone.order,
//             },
//           });
//         }
//         // Création de zone si nécessaire
//         if (
//           zone.id &&
//           typeof zone.id === "string" &&
//           zone.id.startsWith("temp-zone")
//         ) {
//           const zoneResponse = await createZone({
//             variables: { templateId: template.id, zoneOrder: zone.order },
//           });
//           newZoneId = zoneResponse.data.createZone.id;
//         }

//         handleSubZones(zone, newZoneId);
//       }

//       // case si zone a été vidée de ses subZones
//       if (zonesToDelete.length > 0) {
//         await deleteTemplateZones({
//           variables: {
//             zonesId: zonesToDelete,
//             templateId: template.id,
//           },
//         });
//       }

//       // case si clear Zones a été utilisé
//       if (oldZonesId && oldZonesId.length > 0) {
//         await deleteTemplateZones({
//           variables: {
//             zonesId: oldZonesId.flat(),
//             templateId: template.id,
//           },
//         });
//       }

//       // case si des subZones ont été supprimé par le bouton ou un dragNdrop
//       if (oldSubZonesId && oldSubZonesId.length > 0) {
//         await deleteOldSubZones({
//           variables: {
//             oldSubZonesId: oldSubZonesId,
//           },
//         });
//       }

//       console.log(JSON.stringify(templateToModify.zones));

//       if (isModalModifyOpen) {
//         closeModifyModal();
//       }
//       // if (status === "created") {
//       //   router.push("/user/myTemplates").then(() => {
//       //     window.location.reload();
//       //   });
//       // } else if (status === "draft") {
//       //   router.push("/user/myTemplatesDrafts").then(() => {
//       //     window.location.reload();
//       //   });
//       // }

//       console.log("Zones have been successfully updated.");
//     } catch (error) {
//       console.error("Error while updating the template or zones:", error);
//       console.log(error.stack);
//       // Potentiel gestion des erreurs ou rollback ici
//     }
//   };
//   const handleResetZones = (keyToIdentify: string) => {
//     if (keyToIdentify === "templateToModify") {
//       const oldZonesId = templateToModify?.zones
//         ?.filter((zone) => typeof zone.id === "number")
//         .map((zone) => zone.id);

//       setOldZonesId(oldZonesId);
//       resetZones(keyToIdentify);
//     } else {
//       if (zones.some((zone) => zone.content)) {
//         setIsModalOpen(true);
//       } else {
//         resetZones("zones");
//       }
//     }
//   };

//   const resetZones = (keyToIdentify: string) => {
//     // l'objet JS,  URL sert à crée des liens pour la preview d'image, à démonter quand il devient obsolète
//     if (keyToIdentify === "templateToModify") {
//       if (templateToModify) {
//         setTemplateToModify({
//           ...templateToModify,
//           zones: [1, 2, 3].map((number, index) => {
//             return {
//               id: `temp-zone-${number}`,
//               order: index + 1,
//               dndId: `zone-${number}`,
//               subZones: [],
//             };
//           }),
//         });
//       }
//     } else {
//       setZones([
//         { id: "zone-1", order: 1, subZones: [] },
//         { id: "zone-2", order: 2, subZones: [] },
//         { id: "zone-3", order: 3, subZones: [] },
//       ]);
//     }

//     if (imgPreview) {
//       URL.revokeObjectURL(imgPreview);
//       setImgPreview(undefined);
//     }
//     if (imgPreviews) {
//       imgPreviews.forEach((zone) => URL.revokeObjectURL(zone.imgPreview));
//       setImgPreviews(undefined);
//     }
//     if (isModalOpen) {
//       closeModal();
//     }
//   };

//   const handleTemplateChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//     label: string,
//     keyToIdentify: string
//   ) => {
//     const newValue = e.target.value;
//     if (keyToIdentify === "templateToModify") {
//       setTemplateToModify((prevTemplate) => ({
//         ...prevTemplate,
//         [label]: newValue,
//       }));
//     } else {
//       setTemplate((prevTemplate) => ({
//         ...prevTemplate,
//         [label]: newValue,
//       }));
//     }
//   };

//   const createHandleFileChange =
//     (subZoneId: string) =>
//     (
//       event: React.ChangeEvent<HTMLInputElement>,
//       zones: any,
//       keyToIdentify: string
//     ) => {
//       const files = event.target.files;

//       // La fonction sert à créer des previews d'images associées à la subZone target puis à mettre à jour la subZone avec le fichier image en content, elle vide également imgPreview provenant d'URL si besoin

//       if (imgPreviews) {
//         const existingPreview = imgPreviews.find(
//           (obj) => obj.subZoneId === subZoneId
//         );
//         if (existingPreview) {
//           URL.revokeObjectURL(existingPreview.imgPreview);
//           const updatedPreviews = imgPreviews.filter(
//             (obj) => obj.subZoneId !== subZoneId
//           );
//           setImgPreviews(
//             updatedPreviews.length > 0 ? updatedPreviews : undefined
//           );
//         }
//       }

//       if (files && files[0]) {
//         const file = files[0];
//         const newPreviewUrl = URL.createObjectURL(file);
//         if (imgPreviews) {
//           setImgPreviews([
//             ...imgPreviews,
//             { subZoneId, imgPreview: newPreviewUrl },
//           ]);
//         } else {
//           setImgPreviews([{ subZoneId, imgPreview: newPreviewUrl }]);
//         }
//       } else {
//         setImgPreview(undefined);
//       }

//       const updatedZones = zones.map((zone) => ({
//         ...zone,
//         subZones: zone.subZones.map((subZone) => {
//           if (subZone.id === subZoneId) {
//             return { ...subZone, content: files };
//           }
//           return subZone;
//         }),
//       }));

//       if (keyToIdentify === "templateToModify") {
//         if (templateToModify !== null) {
//           // Vérification si non null
//           setTemplateToModify((prevTemplate) => {
//             if (!prevTemplate) {
//               return null;
//             }
//             return {
//               ...prevTemplate,
//               zones: updatedZones,
//             };
//           });
//         } else {
//           console.error("templateToModify is null, cannot update zones");
//         }
//       } else {
//         setZones(updatedZones);
//       }
//     };
//   const handleTextChange = (
//     event: React.ChangeEvent<HTMLTextAreaElement>,
//     subZones: IZone[],
//     subZoneId: string,
//     keyToIdentify: string
//   ) => {
//     const value = event.target.value;

//     // Fonction pour mettre à jour les subZones d'une zone spécifique
//     const updateSubZones = (zones, subZoneId, newContent) => {
//       return zones.map((zone) => {
//         return {
//           ...zone,
//           subZones: zone.subZones.map((subZone) => {
//             if (subZone.id === subZoneId) {
//               return { ...subZone, content: newContent };
//             }
//             return subZone;
//           }),
//         };
//       });
//     };

//     if (keyToIdentify === "templateToModify") {
//       if (templateToModify !== null) {
//         const updatedZones = updateSubZones(
//           templateToModify.zones,
//           subZoneId,
//           value
//         );

//         setTemplateToModify({
//           ...templateToModify,
//           zones: updatedZones,
//         });
//       } else {
//         console.error("templateToModify is null, cannot update zones");
//       }
//     } else {
//       const updatedZones = updateSubZones(zones, subZoneId, value);
//       setZones(updatedZones);
//     }
//   };

//   const getImgPreviewBySubZoneId = (subZoneId: string, moduleType: string) => {
//     let iconSrc;
//     if (moduleType === "image") {
//       iconSrc = imageIconSrc;
//     } else {
//       iconSrc = logoIconSrc;
//     }
//     if (imgPreviews) {
//       return (
//         imgPreviews.find((subZone) => subZone.subZoneId === subZoneId)
//           ?.imgPreview || iconSrc
//       );
//     }
//     return iconSrc;
//   };

//   function getImageSrc(subZone: IZone, type: string) {
//     if (subZone.content instanceof FileList && subZone.content.length > 0) {
//       const file = subZone.content[0];
//       return URL.createObjectURL(file);
//     }

//     return subZone.content || getImgPreviewBySubZoneId(subZone.id, type);
//   }

//   const removeSubZone = (subZone, subZoneId: string, keyToIdentify: string) => {
//     let idToCompare = keyToIdentify === "templateToModify" ? "dndId" : "id";

//     const updateZones = (zones) => {
//       return zones.map((zone) => {
//         const filteredSubZones = zone.subZones.filter(
//           (subZone) => subZone[idToCompare] !== subZoneId
//         );

//         const reorderedSubZones = filteredSubZones.map((subZone, index) => ({
//           ...subZone,
//           order: index + 1,
//         }));

//         return { ...zone, subZones: reorderedSubZones };
//       });
//     };

//     if (keyToIdentify === "templateToModify" && templateToModify) {
//       setTemplateToModify((prevTemplate) => ({
//         ...prevTemplate,
//         zones: updateZones(prevTemplate.zones),
//       }));
//       if (!isTemporarySubZone(subZone)) {
//         setOldSubZonesId((prev) => [...prev, subZone.id]);
//       }
//     } else {
//       setZones((prevZones) => updateZones(prevZones));
//     }

//     if (imgPreview) {
//       URL.revokeObjectURL(imgPreview);
//       setImgPreview(undefined);
//     }

//     if (imgPreviews) {
//       const existingPreview = imgPreviews.find(
//         (obj) => obj.subZoneId === subZoneId
//       );
//       if (existingPreview) {
//         URL.revokeObjectURL(existingPreview.imgPreview);
//         const updatedPreviews = imgPreviews.filter(
//           (obj) => obj.subZoneId !== subZoneId
//         );
//         setImgPreviews(
//           updatedPreviews.length > 0 ? updatedPreviews : undefined
//         );
//         // console.log("Updated imgPreviews:", updatedPreviews);
//       }
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const closeModifyModal = () => {
//     setIsModalModifyOpen(false);
//   };

//   const closeErrorModal = () => {
//     setIsModalErrorOpen(false);
//   };

//   return {
//     saveTemplate,
//     deleteTemplate,
//     handleResetZones,
//     resetZones,
//     handleTemplateChange,
//     createHandleFileChange,
//     handleTextChange,
//     getImgPreviewBySubZoneId,
//     removeSubZone,
//     isModalOpen,
//     setIsModalOpen,
//     isModalModifyOpen,
//     setIsModalModifyOpen,
//     isModalErrorOpen,
//     setIsModalErrorOpen,
//     closeModal,
//     closeModifyModal,
//     closeErrorModal,
//     // onDragEnd,
//     listElements,
//     getImageSrc,
//     saveTemplateToModify,
//   };
// };
//     if (imgPreviews) {
//       const existingPreview = imgPreviews.find(
//         (obj) => obj.subZoneId === subZoneId
//       );
//       if (existingPreview) {
//         URL.revokeObjectURL(existingPreview.imgPreview);
//       }
//       const updatedPreviews = imgPreviews.filter(
//         (obj) => obj.subZoneId !== subZoneId
//       );
//       setImgPreviews(updatedPreviews.length > 0 ? updatedPreviews : undefined);
//     }
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const closeModifyModal = () => {
//     setIsModalModifyOpen(false);
//   };

//   const isTemporaryZone = (zone): boolean => {
//     if (typeof zone.id !== "number" && zone.id.startsWith("temp-zone")) {
//       return true;
//     }
//     return false;
//   };

//   const zoneHasNoValue = (zone): boolean => {
//     return zone.subZones.length === 0;
//   };

//   const addZoneSubZonesToDelete = (zone): number[] => {
//     return zone.subZones
//       ? zone.subZones
//           .filter((subZone) => !isTemporarySubZone(subZone))
//           .map((subZone) => subZone.id)
//       : [];
//   };

//   const isTemporarySubZone = (subZone): boolean => {
//     return typeof subZone.id === "string";
//   };

//   const handleSubZones = async (zone, newZoneId) => {
//     for (const subZone of zone.subZones) {
//       let subZoneContent = subZone.content;
//       if (
//         subZone.moduleType === "image" &&
//         subZone.content instanceof FileList &&
//         subZone.content.length > 0
//       ) {
//         const formData = new FormData();
//         formData.append("file", subZone.content[0]);
//         const uploadResponse = await axios.post(
//           "http://localhost:5000/template-images-upload",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         subZoneContent = uploadResponse.data.url;
//       }

//       const subZoneData = {
//         zoneId: newZoneId,
//         order: subZone.order,
//         moduleType: subZone.moduleType,
//         content: subZoneContent,
//         size: subZone.size || "138",
//         links: subZone.links,
//       };

//       if (isTemporarySubZone(subZone)) {
//         await createSubZone({ variables: { subZoneData } });
//       } else {
//         await modifySubZone({
//           variables: { subZoneId: subZone.id, subZoneData },
//         });
//       }
//     }
//   };

//   return {
//     saveTemplate,
//     handleResetZones,
//     resetZones,
//     handleTemplateChange,
//     createHandleFileChange,
//     handleTextChange,
//     getImgPreviewBySubZoneId,
//     removeSubZone,
//     isModalOpen,
//     setIsModalOpen,
//     isModalModifyOpen,
//     setIsModalModifyOpen,
//     closeModal,
//     closeModifyModal,
//     // onDragEnd,
//     listElements,
//     getImageSrc,
//     saveTemplateToModify,
//     addZoneSubZonesToDelete,
//   };
// };
