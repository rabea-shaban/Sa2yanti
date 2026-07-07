import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import User from '../models/User.model';
import Service from '../models/Service.model';
import Order from '../models/Order.model';

const querySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),
  lng: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),
  radius: Joi.number().positive().required().messages({
    'number.base': 'Radius must be a number',
    'any.required': 'Radius is required',
  }),
  serviceId: Joi.string().hex().length(24).optional().messages({
    'string.base': 'Service ID must be a string',
    'string.hex': 'Service ID must be a valid hex string',
    'string.length': 'Service ID must be 24 characters long',
  }),
});

export const getNearbyTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { lat, lng, radius, serviceId } = value;

    if (serviceId) {
      const serviceExists = await Service.findById(serviceId);
      if (!serviceExists) {
        res.status(404).json({
          success: false,
          message: 'Service not found',
        });
        return;
      }
    }

    const maxDistanceInMeters = radius * 1000;
    const nearby = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          distanceField: 'distance',
          maxDistance: maxDistanceInMeters,
          spherical: true,
          query: {
            role: 'technician',
            isBlocked: false,
            isSuspended: false,
            ...(serviceId ? { services: new mongoose.Types.ObjectId(serviceId) } : {}),
          },
        },
      },
      {
        $addFields: {
          distance: {
            $round: [{ $divide: ['$distance', 1000] }, 1],
          },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'services',
          foreignField: '_id',
          as: 'populatedServices',
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { techId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$technicianId', '$$techId'] },
                    { $eq: ['$status', 'completed'] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'completedJobsArray'
        }
      },
      {
        $addFields: {
          completedJobs: {
            $ifNull: [{ $arrayElemAt: ['$completedJobsArray.count', 0] }, 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          distance: 1,
          rating: 1,
          completedJobs: 1,
          phone: 1,
          address: '$location',
          latitude: 1,
          longitude: 1,
          avatar: 1,
          services: {
            $map: {
              input: '$populatedServices',
              as: 'service',
              in: {
                _id: '$$service._id',
                name: '$$service.name',
              },
            },
          },
        },
      },
    ]);

    const result = nearby.map((tech) => {
      let city = 'القاهرة';
      if (tech.address) {
        const parts = tech.address.split(' - ');
        const cityPart = parts.find((p: string) => p.startsWith('المركز:'));
        if (cityPart) {
          city = cityPart.replace('المركز:', '').trim();
        } else if (parts.length > 1) {
          city = parts[parts.length - 2].replace('المركز:', '').replace('المحافظة:', '').trim();
        }
      }

      return {
        _id: tech._id,
        name: tech.name,
        distance: tech.distance,
        rating: tech.rating ?? 5.0,
        completedJobs: tech.completedJobs ?? 0,
        phone: tech.phone,
        address: tech.address || '',
        city,
        avatar: tech.avatar || '',
        services: tech.services || [],
        latitude: tech.latitude,
        longitude: tech.longitude,
      };
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error fetching nearby technicians:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTechnicianById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid Technician ID' });
      return;
    }

    const technician = await User.findOne({
      _id: id,
      role: 'technician',
      isBlocked: false,
      isSuspended: false,
    })
      .populate('services')
      .lean();

    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }

    const completedJobsCount = await Order.countDocuments({
      technicianId: id,
      status: 'completed',
    });

    const reviews = await Order.find({
      technicianId: id,
      status: 'completed',
      rating: { $gt: 0 }
    })
      .populate('userID', 'name email')
      .sort({ updatedAt: -1 })
      .lean();

    const formattedReviews = reviews.map((r: any) => ({
      _id: r._id,
      clientName: r.userID?.name || 'عميل مجهول',
      rating: r.rating,
      comment: r.comment || '',
      date: r.updatedAt,
    }));

    const ratingsCount = formattedReviews.length;
    const averageRating = ratingsCount > 0 
      ? parseFloat((formattedReviews.reduce((sum, r) => sum + r.rating, 0) / ratingsCount).toFixed(1))
      : 5.0;

    let city = 'القاهرة';
    if (technician.location) {
      const parts = technician.location.split(' - ');
      const cityPart = parts.find((p: string) => p.startsWith('المركز:'));
      if (cityPart) {
        city = cityPart.replace('المركز:', '').trim();
      } else if (parts.length > 1) {
        city = parts[parts.length - 2].replace('المركز:', '').replace('المحافظة:', '').trim();
      }
    }

    res.status(200).json({
      success: true,
      technician: {
        _id: technician._id,
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        rating: averageRating,
        completedJobs: completedJobsCount,
        address: technician.location || '',
        city,
        avatar: technician.avatar || '',
        latitude: technician.latitude,
        longitude: technician.longitude,
        services: technician.services || [],
      },
      reviews: formattedReviews,
    });
  } catch (err: any) {
    console.error('Error fetching technician details:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
